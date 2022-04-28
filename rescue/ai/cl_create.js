/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	CREATE AI STAGE

	Create vehicle and accompanying AI inside vehicle
*/

/**
 * Creates 2-3 rescue personnel inside vehicle
 * @param {number} vehicle vehicle handle
 * @param {string} rescueType 
 * @returns {[boolean, number[]]} rescue personnel
 */
async function createRescuePersonnel(vehicle, rescueType)
{
	const personnel = [];

	// create driver / pilot
	const driverModel = RESCUE_DRIVER[rescueType];
	const driverLoaded = await loadModel(driverModel);

	// prevent execution on load failure
	if (!driverLoaded)
	{
		return [false, null];
	}

	const driver = CreatePedInsideVehicle(vehicle, 4, driverModel, -1, true, false);

	// give pilot helmet
	if (rescueType == RESCUE_TYPES.AIR)
	{
		GivePedHelmet(driver, true, 1, 65536);
	}

	// add driver to personnel
	personnel[personnel.length] = driver;

	// get passenger info
	const passengerInfo = RESCUE_PASSENGER[rescueType];
	const passengerLoaded = await loadModel(passengerInfo.model);

	// prevent execution on load failure
	if (!passengerLoaded)
	{
		return [false, null];
	}

	// create passengers
	for (let i = 0; i < passengerInfo.count; i++)
	{
		const passenger = CreatePedInsideVehicle(vehicle, 4, passengerInfo.model, passengerInfo.seat + i, true, false);

		// add passenger to personnel
		personnel[personnel.length] = passenger;
	}

	return [true, personnel];
}

function onStageBegin()
{
	const [personnelCreated, personnel] = await createRescuePersonnel(vehicle, rescueType);

	// handle personnel creation failure
	if (!personnelCreated)
	{
		return;
	}
}