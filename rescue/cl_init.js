/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Manage player rescue
*/

/**
 * Improvised Enum of available types of rescues
 */
const RESCUE_TYPES =
{
	NONE: "NONE",
	GROUND: "GROUND",
	AIR: "AIR"
};

/**
 * Improvided Enum of rescue stages
 */
const RESCUE_STAGES =
{
	FETCH_POINTS: "FETCH_POINTS",
	CREATE_AI: "CREATE_AI",
	GOTO_PLAYER: "GOTO_PLAYER",
	FETCH_PLAYER: "FETCH_PLAYER",
	STORE_PLAYER: "STORE_PLAYER",
	GOTO_HOSPITAL: "GOTO_HOSPITAL"
};

/**
 * Minimum length between bottom and top height map needed to perform an elevated position check
 * 
 * GTA Metres 0 - ...
 */
const RESCUE_HEIGHT_MIN = 30.0;

/**
 * Maximum length between bottom and top height map needed to skip an elevated position check
 * 
 * GTA Metres 0 - ...
 */
const RESCUE_HEIGHT_MAX = 125.0;

/**
 * Elevated threshold used to determine an elevated position
 * 
 * Percentage 0.0 - 1.0
 */
const RESCUE_ELEVATED_THRESHOLD = 0.45;

/**
 * Maximum distance between a players position and a vehicle node
 * 
 * GTA Metres
 */
const RESCUE_NODE_DIST = 30.0;

/**
 * Maximum height offset between a players position and a vehicle node
 * 
 * GTA Metres
 */
const RESCUE_NODE_HEIGHT = 10.0;

/**
 * Maximum distance between a players position and a path node
 * 
 * GTA Metres
 */
const RESCUE_PATH_DIST = 15.0;

/**
 * Maximum height offset between a players position and a path node
 * 
 * GTA Metres
 */
const RESCUE_PATH_HEIGHT = 5.0;

/**
 * Collision offset used in checking for air rescue collision obstructions
 * 
 * GTA Metres
 */
const RESCUE_COLLISION_OFFSET = 100.0;

/**
 * Height offset above target position needed to rappel down
 */
const RESCUE_RAPPEL_HEIGHT = 10.0;

/**
 * Speed at which vehicles go when travelling to a point
 * 
 * MPH
 */
const RESCUE_VEHICLE_SPEED =
{
	GROUND: 55,
	AIR: 90
}

/**
 * Styles of driving used by rescue vehicle drivers
 */
const RESCUE_VEHICLE_STYLE = 
{
	GROUND: 262148,
	AIR: 262144
}

/**
 * Range at which a vehicle can stop within the target destination
 */
const RESCUE_VEHICLE_STOP_RANGE = 5.0;

/**
 * Get closest hospital to position
 * @param {number[]} pos 
 */
function getClosestHospital(pos)
{
	let closest = RESCUE_HOSPITALS[0];
	let closestDist = getVector2Distance(pos, closest);

	for (let i = 1; i < RESCUE_HOSPITALS.length; i++)
	{
		const hospital = RESCUE_HOSPITALS[i];
		const dist = getVector2Distance(pos, hospital);

		if (dist < closestDist)
		{
			closest = hospital;
			closestDist = dist;
		}
	}

	return closest;
}

/**
 * Determine the best method to use in rescue attempt
 * @param {number} ped 
 * @param {number[]} pos 
 * @returns {string} rescue type
 */
function getRescueType(ped, pos)
{
	// force air rescue if water is involved
	if (IsPedSwimming(ped))
	{
		return RESCUE_TYPES.AIR;
	}

	// get player interior
	const interiorId = GetInteriorFromEntity(ped);

	// check if player in interior
	if (interiorId != null && interiorId != 0)
	{
		// get interior hash
		const [interiorCoords, interiorHash] = GetInteriorInfo(interiorId);
		
		// is player in accessable interior (must have navmeshs)
		if (RESCUE_INTERIOR_WHITELIST.includes(interiorHash))
		{
			return RESCUE_TYPES.GROUND;
		}

		return RESCUE_TYPES.NONE;
	}

	// get player zone
	const zone = GetNameOfZone(pos[0], pos[1], pos[2]);

	// cancel rescue if blacklisted zone
	if (RESCUE_ZONE_BLACKLIST.includes(zone))
	{
		return RESCUE_TYPES.NONE;
	}

	// get heightmap bounds
	const top = GetHeightmapTopZForPosition(pos[0], pos[1]);
	const bottom = GetHeightmapBottomZForPosition(pos[0], pos[1]);
	
	// prevent rescue if not within heightmap bounds
	if (pos[2] < bottom || pos[2] > top)
	{
		return RESCUE_TYPES.NONE;
	}

	// force air rescue if zone can only be reached by air
	if (RESCUE_ZONE_AIR.includes(zone))
	{
		return RESCUE_TYPES.AIR;
	}

	// get safe position for ped
	const [pathFound, path] = GetSafeCoordForPed(pos[0], pos[1], pos[2], false, 1 | 4 | 8);

	// ground rescue if safe
	if (pathFound)
	{
		const dist = getVector2Distance(pos, path);

		// ensure vehicle node is close enough to player
		if (dist < RESCUE_PATH_DIST)
		{
			// calc length between player and path
			const length = pos[2] - path[2];

			// check if length is in range of -RESCUE_PATH_HEIGHT and +RESCUE_PATH_HEIGHT
			if (length < RESCUE_PATH_HEIGHT && length > -RESCUE_PATH_HEIGHT)
			{
				return RESCUE_TYPES.GROUND;
			}
		}
	}

	// get closest vehicle node
	const [nodeFound, node] = GetClosestVehicleNode(pos[0], pos[1], pos[2], 1, 3.0, 0);

	// was node found?
	if (nodeFound)
	{
		const dist = getVector2Distance(pos, node);
		
		// ensure vehicle node is close enough to player
		if (dist < RESCUE_NODE_DIST)
		{
			// calc length between player and node
			const length = pos[2] - node[2];

			// check if length is in range of -RESCUE_NODE_HEIGHT and +RESCUE_NODE_HEIGHT
			if (length < RESCUE_NODE_HEIGHT && length > -RESCUE_NODE_HEIGHT)
			{
				return RESCUE_TYPES.GROUND;
			}
		}
	}

	// get heightmap length
	const length = top - bottom;

	if (length >= RESCUE_HEIGHT_MAX)
	{
		return RESCUE_TYPES.AIR;
	}

	// is heightmap length long enough
	if (length >= RESCUE_HEIGHT_MIN)
	{
		// get percentage based on players height in relation to heightmap
		const percentage = ((pos[2] - bottom) / length).toFixed(2);

		if (percentage >= RESCUE_ELEVATED_THRESHOLD)
		{
			return RESCUE_TYPES.AIR;
		}
	}

	return RESCUE_TYPES.GROUND;
}

/**
 * Get start point for rescue
 * @param {[number, number, number]} pos player position
 * @returns {[number, number, number, number]} start point
 */
function getStartPoint(pos)
{
	// get random point offset
	const randomPoint = getVector2RandomOffset(pos, RESCUE_SPAWN_DIST);
	// get closest node from random point offset
	const [nodeFound, node, nodeHeading] = getVector2ClosestVehicleNode(randomPoint, true);
	
	if (nodeFound)
	{
		return [node[0], node[1], node[2], nodeHeading];
	}

	// get heightmap bottom
	const bottom = GetHeightmapBottomZForPosition(randomPoint[0], randomPoint[1]);

	return [randomPoint[0], randomPoint[1], bottom, 0.0];
}

/**
 * Get delivery point for rescue
 * @param {[number, number, number]} pos player position
 * @returns {[number, number, number]} delivery point
 */
function getDeliveryPoint(pos)
{
	// get closest hospital
	const closestHospital = getClosestHospital(pos);
	// calc random point
	const randomPoint = getVector2Random(pos, closestHospital, 0.2, 0.5);
	// get closest node from random point
	const [nodeFound, node] = getVector2ClosestVehicleNode(randomPoint);

	if (nodeFound)
	{
		return [node[0], node[1], node[2]];
	}

	// get heightmap bottom
	const bottom = GetHeightmapBottomZForPosition(randomPoint[0], randomPoint[1]);

	return [randomPoint[0], randomPoint[1], bottom];
}

/**
 * Get end point for rescue
 * @param {[number, number, number]} pos player position
 * @returns {[number, number, number]} end point
 */
function getEndPoint(pos)
{
	// get closest node from player position
	const [nodeFound, node] = getVector2ClosestVehicleNode(pos);
	
	if (nodeFound)
	{
		const dist = getVector2Distance(pos, node);

		// ensure vehicle node is close enough to player
		if (dist < RESCUE_NODE_DIST)
		{
			return [node[0], node[1], node[2]];
		}		
	}

	return [pos[0], pos[1], pos[2]];
}

/**
 * Creates a rescue vehicle at specific point with heading
 * @param {[number, number, number, number]} point 
 * @param {string} rescueType 
 * @returns {number} vehicle handle
 */
async function createRescueVehicle(point, rescueType)
{
	// get vehicle model
	const model = RESCUE_VEHICLE[rescueType];

	// load vehicle model
	const loaded = await loadModel(model);

	// prevent execution on load failure
	if (!loaded)
	{
		return 0;
	}
	
	// create vehicle
	const vehicle = CreateVehicle(model, point[0], point[1], point[2], point[3], true, false);

	// rescue type specific vehicle options
	if (rescueType == RESCUE_TYPES.GROUND)
	{
		SetVehicleOnGroundProperly(vehicle);
	}
	
	// set livery
	SetVehicleLivery(vehicle, 1);

	// enable siren
	SetVehicleSiren(vehicle, true);

	// unload model from memory
	SetModelAsNoLongerNeeded(model);

	return vehicle;
}

/**
 * Creates 2-3 rescue personnel inside vehicle
 * @param {number} vehicle vehicle handle
 * @param {string} rescueType 
 * @returns {[boolean, number[]]} rescue personnel
 */
async function createRescuePersonnel(vehicle, rescueType)
{
	const personnel = [];

	// create driver / pilot
	const driverModel = RESCUE_DRIVER[rescueType];
	const driverLoaded = await loadModel(driverModel);

	// prevent execution on load failure
	if (!driverLoaded)
	{
		return [false, null];
	}

	const driver = CreatePedInsideVehicle(vehicle, 4, driverModel, -1, true, false);

	// give pilot helmet
	if (rescueType == RESCUE_TYPES.AIR)
	{
		GivePedHelmet(driver, true, 1, 65536);
	}

	// add driver to personnel
	personnel[personnel.length] = driver;

	// get passenger info
	const passengerInfo = RESCUE_PASSENGER[rescueType];
	const passengerLoaded = await loadModel(passengerInfo.model);

	// prevent execution on load failure
	if (!passengerLoaded)
	{
		return [false, null];
	}

	// create passengers
	for (let i = 0; i < passengerInfo.count; i++)
	{
		const passenger = CreatePedInsideVehicle(vehicle, 4, passengerInfo.model, passengerInfo.seat + i, true, false);

		// add passenger to personnel
		personnel[personnel.length] = passenger;
	}

	return [true, personnel];
}

/**
 * Try to rescue a downed player and bring them to the hospital for revival
 */
async function startRescue()
{
	const ped = PlayerPedId();
	const pos = GetEntityCoords(ped);

	// determine type of rescue
	let rescueType = getRescueType(ped, pos);

	// stop rescue
	if (rescueType == RESCUE_TYPES.NONE)
	{
		return;
	}

	// ensure air rescue isn't obstructed by a collision above entity
	if (rescueType == RESCUE_TYPES.AIR)
	{
		const [status, hit] = await raycast(pos, [pos[0], pos[1], pos[2] + RESCUE_COLLISION_OFFSET], ped, 1 | 16);
		// is air rescue obstructed
		if (status == 2 && hit)
		{
			// force ground rescue
			rescueType = RESCUE_TYPES.GROUND;
		}
	}	

	// -----------------------------------------------------
	// prepare key positions needed for rescue

	// calc delivery point
	const deliveryPoint = getDeliveryPoint(pos);
	// calc start point
	const startPoint = getStartPoint(pos);
	// calc end point
	const endPoint = getEndPoint(pos);

	// offset points for air
	if (rescueType == RESCUE_TYPES.AIR)
	{
		// use exact player x,y,z
		endPoint[0] = pos[0];
		endPoint[1] = pos[1];
		endPoint[2] = pos[2];

		// ensure points are in the air
		deliveryPoint[2] += RESCUE_RAPPEL_HEIGHT;
		startPoint[2] += RESCUE_RAPPEL_HEIGHT;
		endPoint[2] += RESCUE_RAPPEL_HEIGHT;

		// point vehicle towards end point
		startPoint[3] = GetHeadingFromVector_2d(endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]);
	}

	const vehicle = await createRescueVehicle(startPoint, rescueType);

	// handle vehicle creation failure
	if (vehicle == 0)
	{
		return;
	}

	const [personnelCreated, personnel] = await createRescuePersonnel(vehicle, rescueType);

	// handle personnel creation failure
	if (!personnelCreated)
	{
		return;
	}


	// get vehicle driver
	const driver = personnel[0];
	// get vehicle travelling speed
	const speed = RESCUE_VEHICLE_SPEED[rescueType] / MPH_OFFSET;
	// get vehicle model
	const model = RESCUE_VEHICLE[rescueType];
	// get driving style
	const style = RESCUE_VEHICLE_STYLE[rescueType];

	// drive vehicle to point
	TaskVehicleDriveToCoord(driver, vehicle, endPoint[0], endPoint[1], endPoint[2], speed, 0, model, style, RESCUE_VEHICLE_STOP_RANGE, 0.0);
}

/**
 * Listen for a players death
 */
function onPlayerDeath()
{
	// TODO
}

/**
 * Init event listeners & vars
 */
function init()
{
	on("playerDead", onPlayerDeath);
}

init();

RegisterCommand("meep", (src, args, raw) =>
{
	startRescue();
});