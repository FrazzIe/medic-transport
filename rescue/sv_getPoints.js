/**
 * Handle stage result payload
 * @param {object} rescue
 * @param {object} payload
 */
function onStageResult(rescue, payload)
{
	// validate start point
	if (payload.startPoint == null || payload.startPoint.length != 4)
	{
		rescue.status = RESCUE_STATUS.FAILED;
		return;
	}

	// validate end point
	if (payload.endPoint == null || payload.endPoint.length != 3)
	{
		rescue.status = RESCUE_STATUS.FAILED;
		return;
	}

	// validate delivery  point
	if (payload.deliveryPoint == null || payload.deliveryPoint.length != 3)
	{
		rescue.status = RESCUE_STATUS.FAILED;
		return;
	}

	// store points
	rescue.points.start = payload.startPoint;
	rescue.points.end = payload.endPoint;
	rescue.points.delivery = payload.deliveryPoint;
}

/**
 * Init event listeners & vars
 */
function init()
{
	RESCUE_FUNCTION_RESULT[RESCUE_STAGE.GET_POINTS] = onStageResult;
}

init();