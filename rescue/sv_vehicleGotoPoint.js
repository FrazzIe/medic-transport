/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	VEHICLE GOTO POINT STAGE

	Move vehicle to point
*/

/**
 * Handle stage result payload
 * @param {object} rescue
 * @param {object} payload
 */
function onStageResult(rescue, payload)
{
	// set failed status if unsuccessful
	if (!payload.success)
	{
		rescue.status = RESCUE_STATUS.FAILED;
	}
}

/**
 * Init event listeners & vars
 */
function init()
{
	// add stage to stage func map
	RESCUE_FUNCTION_RESULT[RESCUE_STAGE.VEHICLE_GOTO_POINT] = onStageResult;
}
 
init();