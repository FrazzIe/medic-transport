/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	VEHICLE CREATE STAGE

	Create vehicle for rescue
*/

/**
 * Number of miliseconds to wait before giving up on vehicle creation
 */
const CREATE_VEHICLE_TIMEOUT = 15000;

/**
 * Initiate stage
 * @param {object} rescue
 * @param {number | string} src   
 */
async function onStageInit(rescue, src)
{
	// get vehicle model
	const model = RESCUE_VEHICLE[rescue.type];

	// create vehicle
	const vehicle = CreateVehicle(model, rescue.points.start[0], rescue.points.start[1], rescue.points.start[2], rescue.points.start[3], true, false);	

	const timeout = GetGameTimer() + CREATE_VEHICLE_TIMEOUT;

	// wait for vehicle to be created
	while (!DoesEntityExist(vehicle) && GetGameTimer() < timeout)
	{
		await delay(0);
	}

	// handle creation failure
	if (!DoesEntityExist(vehicle))
	{
		// TODO
		return;
	}

	// get vehicle network id
	const netId = NetworkGetNetworkIdFromEntity(vehicle);

	// get vehicle owner
	const owner = NetworkGetEntityOwner(vehicle);

	// handle vehicle assignment failure
	if (owner == -1)
	{
		// TODO
		return;
	}

	// customise vehicle
	emitNet("rescueCustomise", owner, rescue, netId);

	// end stage
	// send id
	emit("rescueStage", { netId }, src);
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