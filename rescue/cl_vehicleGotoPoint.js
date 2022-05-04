/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	VEHICLE GOTO POINT STAGE

	Move vehicle to point
*/

/**
 * Speed at which vehicles go when travelling to a point
 * 
 * MPH
 */
const RESCUE_VEHICLE_SPEED =
{
	GROUND: 55,
	AIR: 90
}

/**
 * Styles of driving used by rescue vehicle drivers
 */
const RESCUE_VEHICLE_STYLE = 
{
	GROUND: 262148,
	AIR: 262144
}

/**
 * Range at which a vehicle can stop within the target destination
 */
const RESCUE_VEHICLE_STOP_RANGE = 5.0;

/**
 * Number of retry attempts to ensure vehicle reaches a destination
 */
const RESCUE_VEHICLE_GOTO_ATTEMPT = 3;

/**
 * Track a vehicle's position and ensure it reaches a destination
 * @param {number} ped ped driver handle
 * @param {number} vehicle vehicle handle
 * @param {[number, number, number]} destination vehicle destination
 * @param {number} speed vehicle cruise speed
 * @param {number} model vehicle model
 * @param {number} style ped vehicle driving style
 */
async function trackVehicle(ped, vehicle, destination, speed, model, style)
{
	let attempts = RESCUE_VEHICLE_GOTO_ATTEMPT;

	while(attempts > 0)
	{
		// TODO

	}

	throw new Error(`Failed to reach vehicle destination after retrying ${RESCUE_VEHICLE_GOTO_ATTEMPT} times`);
}

/**
 * Initiate stage
 * @returns {void}
 */
function onStageInit(rescue)
{
	/*
		VEHICLE_GOTO_POINT is to be used for going to multiple points
		same with PED_GOTO_POINT.

		Temporary solution for getting point destination from stage idx

		Possible long term solutions:
		- Keep a point index, increment after each GOTO_POINT stage (might not work for dyanmic points?)
		- Separate into more stages e.g. GOTO_START, GOTO_END, GOTO_X
			- Allows for dyanmic points
			- Call GOTO_POINT as helper function?
	*/
	let destination;

	switch(rescue.stageIdx)
	{
		case 4:
		{
			destination = rescue.points.end;
			break;
		}
		case 16:
		{
			destination = rescue.points.delivery;
			break;
		}
		case 19:
		default:
		{
			destination = rescue.points.start;
			break;
		}
	}

	// get vehicle travelling speed
	const speed = RESCUE_VEHICLE_SPEED[rescue.type] / MPH_OFFSET;
	// get vehicle model
	const model = RESCUE_VEHICLE[rescue.type];
	// get driving style
	const style = RESCUE_VEHICLE_STYLE[rescue.type];

	// array of promises
	// used in a race
	const promises = [];

	// entity safety checks
	promises[promises.length] = entitySafetyCheck(rescue.vehicle);

	for (let i = 0; i < rescue.peds.length; i++)
	{
		promises[promises.length] = entitySafetyCheck(rescue.peds[i]);
	}
	
	// track vehicle
	promises[promises.length] = trackVehicle(rescue.peds[0], rescue.vehicle, destination, speed, model, style);
	
}

/**
 * Init event listeners & vars
 */
function init()
{
	// add stage to stage func map
	RESCUE_FUNCTION_INIT[RESCUE_STAGE.VEHICLE_GOTO_POINT] = onStageInit;
}
 
init();