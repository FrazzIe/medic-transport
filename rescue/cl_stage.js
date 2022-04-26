/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Listen for rescue stage changes
	& Start client-side stages
*/

/**
 * Listen for stage change
 * @param {object} rescue 
 */
function onStage(rescue)
{
	// get curr stage
	const stage = RESCUE_STAGE[rescue.stageIndex];

	// does stage func exist?
	if (RESCUE_FUNCTION[stage] == null)
	{
		// TODO
		return;
	}

	// call stage init
	RESCUE_FUNCTION[stage](rescue);
}

/**
 * Init event listeners & vars
 */
function init()
{
	// add rescueStage event listener
	onNet("rescueStage", onStage);
}