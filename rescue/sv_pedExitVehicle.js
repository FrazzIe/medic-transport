/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	PED EXIT VEHICLE STAGE

	Ensure all peds exit the vehicle
*/

/**
 * Initiate stage
 * @param {object} rescue
 * @param {number | string} src   
 */
async function onStageInit(rescue, src)
{
	// TODO
}

/**
 * Init event listeners & vars
 */
function init()
{
	// add stage to stage func map
	RESCUE_FUNCTION_INIT[RESCUE_STAGE.PED_EXIT_VEHICLE] = onStageInit;
}

init();