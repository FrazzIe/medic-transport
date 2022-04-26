/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	Listen for rescue stage completion
	& Call stage init funcs
*/

/**
 * Listen for stage completion
 * @param {object} payload 
 */
function onStage(payload)
{
	// get player id
	const src = global.source;

	// get rescue object
	const rescue = rescues[src];

	// get curr stage
	const lastStage = RESCUE_STAGE[rescue.stageIndex];

	// TODO: handle stage payloads
	switch(lastStage)
	{
		case RESCUE_STAGE.GET_TYPE:
		{
			// assign rescue type
			rescue.type = payload.rescueType;

			// set failed status if invalid rescue type
			if (rescue.type == null || rescue.type == RESCUE_TYPE.NONE)
			{
				rescue.status = RESCUE_STATUS.FAILED;
			}

			break;
		}
	}

	// change stage
	// get curr stage
	const nextStage = RESCUE_STAGE[++rescue.stageIndex];

	// TODO: handle next steps
}

/**
 * Init event listeners & vars
 */
function init()
{
	// add rescueStage event listener
	onNet("rescueStage", onStage);
}