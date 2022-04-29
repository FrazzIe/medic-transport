/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	Manage and track all rescues
*/

/**
 * Contains each stage result function
 * 
 * Map of stage -> function
 * 
 * key: RESCUE_STAGE Enum
 * 
 * value: function 
 */
const RESCUE_FUNCTION_RESULT = {};

/**
 * Map of rescues
 * 
 * key: server id
 * value: rescue obj
 */
const rescues = {};

/**
 * Start a player rescue
 * 
 * Called externally from the server
 */
function onStartRescue(src)
{
	// prevent starting another rescue
	if (rescues[src] != null)
	{
		return;
	}

	const ped = GetPlayerPed(src);

	// ensure player ped exists
	if (!DoesEntityExist(ped))
	{
		return;
	}

	// get player coords
	const pos = GetEntityCoords(ped);

	// create rescue
	rescues[src] = 
	{
		status: RESCUE_STATUS.ONGOING,
		stageIndex: 0,
		points: { player: pos }
	};

	// start rescue stage
	emitNet("rescueStage", src, rescues[src]);
}

/**
 * Init event listeners & vars
 */
function init()
{
	// add rescuePlayer event listener
	on("rescuePlayer", onStartRescue);
}

init();

