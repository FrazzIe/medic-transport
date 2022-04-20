/**
 * Improvised Enum of available types of rescues
 */
const RESCUE_TYPES =
{
	NONE: 0,
	GROUND: 1,
	AIR: 2
};

/**
 * List of hospital delivery locations
 */
const RESCUE_HOSPITALS =
[
	[ 340.73, -560.04, 28.74 ],   // DOWNT
	[ -492.00, -336.81, 34.37 ],  // ROCKF
	[ 298.50, -1442.30, 29.79 ],  // DAVIS
	[ 1153.37, -1512.34, 34.69 ], // EBURO
	[ 1827.27, 3693.52, 34.22 ],  // SANDY
	[ -237.30, 6332.01, 32.40 ]   // PALETO
]

/**
 * How far away a rescue should be spawned from death location
 * 
 * GTA Metres
 */
const RESCUE_SPAWN_DIST = 300.0;

/**
 * List of zones that are unreachable
 */
const RESCUE_ZONE_BLACKLIST = [ "ARMYB", "JAIL" ];

/**
 * List of zones that can only be reached by air
 */
const RESCUE_ZONE_AIR = [ "PALCOV", "OCEANA" ];

/**
 * List of interior hashes that are reachable
 */
const RESCUE_INTERIOR_WHITELIST =
[
	1847849587, // AIRPORT HANGAR
	1932111343, // ROGERS SALVAGE & SCRAP
	-1760196495, // BARBER SHOP
	-1738793216, // AMMU-NATION SMALL
	-26658153, // AMMU-NATION BIG
	371397885, // MAZEBANK GARAGE 01
	-1710765799, // MAZEBANK GARAGE 02
	1753457757, // BINCO CLOTHING
	225974099, // SUBURBAN CLOTHING
	-1690750853, // 24/7 STORE
	-945079088, // ROCKFORD PLAZA
	-429983331, // PACIFIC STANDARD BANK
	1338737678, // FLEECA BANK
	607268480, // BLAINE COUNTY SAVINGS BANK
	-1716756720, // ICE PLANET JEWELRY
	1457285595, // TEQUI-LA-LA
	-298980389, // PONSONBYS
	1724779208, // DEL PERRO BEACH APT.
	-1407739860, // MISSION ROW POLICE DEPARTMENT
	-371481864, // PALETO SHERIFFS OFFICE
	-400174009, // SANDY SHERIFFS OFFICE
	-89256394, // LS CUSTOMS 01
	100117129, // LS CUSTOMS 02
	-1070602979, // LS CUSTOMS 03
	299191145, // BENNY'S ORIGINAL MOTORWORKS
	1314234446, // VANILLA UNICORN
	-1480564353, // TATTOO SHOP
	-1437859694, // PALETO TUNNEL 01
	560393926, // PALETO TUNNEL 02
	249579961, // PALETO TUNNEL 03
	2136268782, // STRAWBERRY TUNNEL 01
	260467921, // STRAWBERRY TUNNEL 02
	-1935705469, // STRAWBERRY TUNNEL 03
	604839936, // UNION DEPOSITORY
	-1514137385, // UNDERGROUND PARKING
	// VANGELICO JEWELRY
	// SWEAT SHOP
	// PREMIUM DELUXE MOTORSPORT
];

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
 * Determine the best method to use in rescue attempt
 * @param {number} ped 
 * @param {number[]} pos 
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
 * Try to rescue a downed player and bring them to the hospital for revival
 */
function startRescue()
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
		const [status, hit] = await raycast(pos, [ pos[0], pos[1], pos[2] + RESCUE_COLLISION_OFFSET], ped, 1 | 16);
		
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