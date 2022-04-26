/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	GET TYPE STAGE

	Determine the best method to use in rescue attempt
*/

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
 * Initiate stage
 * @returns {void}
 */
function onStageInit(rescue)
{
	const ped = PlayerPedId();

	// determine type of rescue
	let rescueType = getRescueType(ped, pos);

	// ensure air rescue isn't obstructed by a collision above entity
	if (rescueType == RESCUE_TYPES.AIR)
	{
		const [status, hit] = await raycast(pos, [ rescue.points.player[0], rescue.points.player[1], rescue.points.player[2] + RESCUE_COLLISION_OFFSET ], ped, 1 | 16);

		// is air rescue obstructed
		if (status == 2 && hit)
		{
			// force ground rescue
			rescueType = RESCUE_TYPES.GROUND;
		}
	}

	// end stage
	// give server result
	emitNet("rescueStage", { rescueType });
}

/**
 * Init event listeners & vars
 */
function init()
{
	// add stage to stage func map
	RESCUE_FUNCTION[RESCUE_STAGE.GET_TYPE] = onStageInit;
}

init();