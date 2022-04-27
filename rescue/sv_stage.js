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

	// check if a failure has occured
	if (rescue.status == RESCUE_STATUS.FAILED)
	{
		// TODO: handle failure
		return;
	}

	// change stage
	// get curr stage
	const nextStage = RESCUE_STAGE[++rescue.stageIndex];

	// start rescue stage on client
	switch(nextStage)
	{
		case RESCUE_STAGE.GET_POINTS:
		case RESCUE_STAGE.AI_ATTACH_OBJECT:
		case RESCUE_STAGE.AI_DETACH_OBJECT:
		case RESCUE_STAGE.VEHICLE_GOTO_POINT:
		case RESCUE_STAGE.VEHICLE_ATTACH_OBJECT:
		case RESCUE_STAGE.VEHICLE_DETACH_OBJECT:
		case RESCUE_STAGE.OBJECT_ATTACH_PLAYER:
		case RESCUE_STAGE.OBJECT_DETACH_PLAYER:
		case RESCUE_STAGE.PLAYER_TELEPORT:
		{
			emitNet("rescueStage", rescues[src]);
			return;
		}
	}

	// does stage func exist?
	if (RESCUE_FUNCTION[nextStage] == null)
	{
		// TODO
		return;
	}

	// call stage init
	RESCUE_FUNCTION[nextStage](src);
}

/**
 * Init event listeners & vars
 */
function init()
{
	// add rescueStage event listener
	onNet("rescueStage", onStage);
}