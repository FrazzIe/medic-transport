/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Listen for rescue stage changes
	& Call stage init funcs
*/

/**
 * Listen for stage change
 * @param {object} rescue 
 */
function onStage(rescue)
{
	// get curr stage
	const stage = RESCUE_ORDER[rescue.stageIndex];

	// does stage func exist?
	if (RESCUE_FUNCTION_INIT[stage] == null)
	{
		// TODO
		return;
	}

	// call stage init
	RESCUE_FUNCTION_INIT[stage](rescue);
}

/**
 * Init event listeners & vars
 */
function init()
{
	// add rescueStage event listener
	onNet("rescueStage", onStage);
}

init();