/**
 * Handle stage result payload
 * @param {object} rescue
 * @param {object} payload
 */
function onStageResult(rescue, payload)
{
	// set failed status if invalid rescue type
	if (payload.rescueType == null || payload.rescueType == RESCUE_TYPE.NONE)
	{
		rescue.status = RESCUE_STATUS.FAILED;
		return;
	}

	// assign rescue type
	rescue.type = payload.rescueType;

	console.log("store type");
}

/**
 * Init event listeners & vars
 */
function init()
{
	RESCUE_FUNCTION_RESULT[RESCUE_STAGE.GET_TYPE] = onStageResult;
}

init();