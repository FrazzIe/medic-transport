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
 * The number of seconds a vehicle must be off course 
 * or fully stopped before forcing a timeout
 */
const RESCUE_VEHICLE_GOTO_TIMEOUT = 60;

/**
 * Distance threshold used during a complete failure to check
 * if it's possible to reach point on foot
 */
const RESCUE_VEHICLE_GOTO_WALKING_THRESHOLD = 50.0;

/**
 * Track a vehicle's position and ensure it reaches a destination
 * @param {number} ped ped driver network id
 * @param {number} vehicle vehicle network id
 * @param {[number, number, number]} destination vehicle destination
 * @param {number} speed vehicle cruise speed
 * @param {number} model vehicle model
 * @param {number} style ped vehicle driving style
 * @param {object} info
 * @param {boolean} info.cancel should promise be cancelled
 */
async function trackVehicle(pedNetId, vehicleNetId, destination, speed, model, style, info)
{
	let attempts = RESCUE_VEHICLE_GOTO_ATTEMPT + 1;
	let timeout = RESCUE_VEHICLE_GOTO_TIMEOUT;
	let lastDist;

	while(attempts > 0)
	{
		if (info.cancel)
		{
			return;
		}

		// has vehicle tracking timed out?
		// should we retry?
		if (timeout >= RESCUE_VEHICLE_GOTO_TIMEOUT)
		{						
			// get ped & vehicle handles
			const ped = NetworkGetEntityFromNetworkId(pedNetId);
			const vehicle = NetworkGetEntityFromNetworkId(vehicleNetId);

			// skip non-existant entities
			// safety check will catch this
			if (!DoesEntityExist(ped) || !DoesEntityExist(vehicle))
			{
				continue;
			}

			console.info("Drive to point");
			console.info(`attempts: ${attempts}, timeout: ${timeout}`);

			// drive vehicle to point
			TaskVehicleDriveToCoord(ped, vehicle, destination[0], destination[1], destination[2], speed, 0, model, style, RESCUE_VEHICLE_STOP_RANGE, 0.0);

			// reset timeout, remove attempt
			timeout = 0;
			attempts--;


			// are we out of retry attempts?
			if (attempts <= 0)
			{
				console.info("out of retry attempts");
				break;
			}
		}

		// get vehicle handle
		const vehicle = NetworkGetEntityFromNetworkId(vehicleNetId);

		// skip non-existant entity
		// safety check will catch this
		if (!DoesEntityExist(vehicle))
		{
			continue;
		}

		// get vehicle pos
		const pos = GetEntityCoords(vehicle);

		// get distance between vehicle & destination
		const dist = getVector2Distance(pos, destination);

		console.info(`dist: ${dist}, stop range: ${RESCUE_VEHICLE_STOP_RANGE + (RESCUE_VEHICLE_STOP_RANGE / 2)}, timeout: ${timeout}`);

		// in range of destination?
		if (dist < RESCUE_VEHICLE_STOP_RANGE + (RESCUE_VEHICLE_STOP_RANGE / 2))
		{
			return true;
		}

		if (lastDist != null)
		{
			// is vehicle further away?
			// or sitting still
			if (dist >= lastDist - RESCUE_VEHICLE_STOP_RANGE)
			{
				timeout++;
			}
			else if (timeout != 0)
			{
				timeout = 0;
			}
		}

		// store distance
		lastDist = dist;

		await delay(1000);
	}

	// handle complete failure

	// get vehicle handle
	const vehicle = NetworkGetEntityFromNetworkId(vehicleNetId);

	// ensure vehicle exists
	if (DoesEntityExist(vehicle))
	{
		// get vehicle pos
		const pos = GetEntityCoords(vehicle);

		// get distance between vehicle & destination
		const dist = getVector2Distance(pos, destination);

		// are we in walking distance?
		// can the rescue be recovered on foot?
		if (dist < RESCUE_VEHICLE_GOTO_WALKING_THRESHOLD)
		{
			return true;
		}
	}

	throw new Error(`Failed to reach vehicle destination after retrying ${RESCUE_VEHICLE_GOTO_ATTEMPT} times`);
}

/**
 * Initiate stage
 * @returns {void}
 */
async function onStageInit(rescue)
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

	switch(rescue.stageIndex)
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

	// promise info
	// used to cancel remaining promises
	const info = { cancel: false };

	// array of promises
	// used in a race
	const promises = [];

	// entity safety checks
	promises[promises.length] = entitySafetyCheck(rescue.vehicle, info);

	for (let i = 0; i < rescue.peds.length; i++)
	{
		promises[promises.length] = entitySafetyCheck(rescue.peds[i], info);
	}
	
	// track vehicle
	promises[promises.length] = trackVehicle(rescue.peds[0], rescue.vehicle, destination, speed, model, style, info);
	
	// race the promises
	let success = true;

	try
	{
		const p = await Promise.race(promises);
		console.log(p);
	}
	catch(err)
	{
		console.info(err.message);
		success = false;
	}

	// stop all running promises
	info.cancel = true;

	// end stage
	// give server result
	emitNet("rescueStage", { success });
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