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
 * Collision offset used in checking for air rescue collision obstructions
 * 
 * GTA Metres
 */
const RESCUE_COLLISION_OFFSET = 100.0;

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