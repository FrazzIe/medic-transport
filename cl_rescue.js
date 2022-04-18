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
const RESCUE_INTERIOR_WHITELIST = [];

/**
 * Minimum length between bottom and top height map needed to perform an elevated position check
 * 
 * GTA Metres 0 - ...
 */
const RESCUE_HEIGHT_THRESHOLD = 30.0;

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
 * Get random point offset from player
 * @param {number[]} pos 
 */
function getRandomRescuePoint(pos)
{
	/*
		E          A          F
		           |
		           |
		           |
		D ---------+--------- B
		           |
		           |
		           |
		H          C          G
	*/
	const points = 
	[
		[ pos[0], pos[1] + RESCUE_SPAWN_DIST ], // A
		[ pos[0] + RESCUE_SPAWN_DIST, pos[1] ], // B
		[ pos[0], pos[1] - RESCUE_SPAWN_DIST ], // C
		[ pos[0] - RESCUE_SPAWN_DIST, pos[1] ], // D
		
		[ pos[0] - RESCUE_SPAWN_DIST, pos[1] + RESCUE_SPAWN_DIST ], // E
		[ pos[0] + RESCUE_SPAWN_DIST, pos[1] + RESCUE_SPAWN_DIST ], // F
		[ pos[0] + RESCUE_SPAWN_DIST, pos[1] - RESCUE_SPAWN_DIST ], // G
		[ pos[0] - RESCUE_SPAWN_DIST, pos[1] - RESCUE_SPAWN_DIST ], // H
	];

	const random = Math.floor(Math.random() * points.length);

	return points[random];
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

	// is heightmap length long enough
	if (length >= RESCUE_HEIGHT_THRESHOLD)
	{
		// get percentage based on players height in relation to heightmap
		const percentage = ((pos[2] - bottom) / length).toFixed(2);

		if (percentage >= RESCUE_ELEVATED_THRESHOLD)
		{
			return RESCUE_TYPES.AIR;
		}
	}
}

/**
 * Listen for a players death
 */
function onPlayerDeath()
{
	const ped = PlayerPedId();
	const pos = GetEntityCoords(ped);

	// get closest hospital
	const closestHospital = getClosestHospital(pos);
	// calc delivery point
	const deliveryPoint = getVector2Random(pos, closestHospital, 0.2, 0.5);
	// calc start point
	const startPoint = getRandomRescuePoint(pos);
}

/**
 * Init event listeners & vars
 */
function init()
{
	on("playerDead", onPlayerDeath);
}

init();