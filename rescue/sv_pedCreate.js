/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	PED CREATE STAGE

	Create ped for rescue
*/

/**
 * Initiate stage
 * @param {object} rescue
 * @param {number | string} src   
 */
async function onStageInit(rescue, src)
{

}

/**
 * Init event listeners & vars
 */
function init()
{
	// add stage to stage func map
	RESCUE_FUNCTION_INIT[RESCUE_STAGE.PED_CREATE] = onStageInit;
}

init();