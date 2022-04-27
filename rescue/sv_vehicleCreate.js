/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	VEHICLE CREATE STAGE

	Create vehicle for rescue
*/

/**
 * Initiate stage
 * @param {object} rescue
 * @param {number | string} src   
 */
function onStageInit(rescue, src)
{

}

/**
 * Init event listeners & vars
 */
function init()
{
	// add stage to stage func map
	RESCUE_FUNCTION[RESCUE_STAGE.VEHICLE_CREATE] = onStageInit;
}
  
init();