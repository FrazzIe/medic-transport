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
	GET_TYPE: "GET_TYPE",
	GET_POINTS: "GET_POINTS",
	AI_CREATE: "AI_CREATE",
	AI_EXIT_VEHICLE: "AI_EXIT_VEHICLE",
	AI_GOTO_POINT: "AI_GOTO_POINT",
	AI_GRAB_PLAYER: "AI_GRAB_PLAYER",
	AI_STORE_PLAYER: "AI_STORE_PLAYER",
	AI_ENTER_VEHICLE: "AI_ENTER_VEHICLE",
	VEHICLE_GOTO_POINT: "VEHICLE_GOTO_POINT"
};

/**
 * Improvided Enum of rescue status
 */
const RESCUE_STATUS =
{
	FAILED: "FAILED",
	ONGOING: "ONGOING",
	COMPLETE: "COMPLETE"
};

/**
 * Try to rescue a downed player and bring them to the hospital for revival
 */
async function startRescue()
{
	// TODO	
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