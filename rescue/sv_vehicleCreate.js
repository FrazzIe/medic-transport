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
async function onStageInit(rescue, src)
{
	// get vehicle model
	const model = RESCUE_VEHICLE[rescue.type];

	// create vehicle
	const vehicle = CreateVehicle(model, rescue.points.start[0], rescue.points.start[1], rescue.points.start[2], rescue.points.start[3], true, false);	

	console.log(vehicle);
	console.log(DoesEntityExist(vehicle));

	while (!DoesEntityExist(vehicle))
	{
		console.log(DoesEntityExist(vehicle), "waiting", model, rescue.points.start);
		await delay(0);
	}

	console.log(NetworkGetNetworkIdFromEntity(vehicle));
	console.log(NetworkGetEntityOwner(vehicle));
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