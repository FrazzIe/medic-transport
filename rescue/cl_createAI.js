/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	CREATE AI RESCUE STAGE

	Create vehicle for rescue and accompanying AI inside vehicle
*/

/**
 * Creates a rescue vehicle at specific point with heading
 * @param {[number, number, number, number]} point 
 * @param {string} rescueType 
 * @returns {number} vehicle handle
 */
async function createRescueVehicle(point, rescueType)
{
	// get vehicle model
	const model = RESCUE_VEHICLE[rescueType];

	// load vehicle model
	const loaded = await loadModel(model);

	// prevent execution on load failure
	if (!loaded)
	{
		return 0;
	}
	
	// create vehicle
	const vehicle = CreateVehicle(model, point[0], point[1], point[2], point[3], true, false);

	// rescue type specific vehicle options
	if (rescueType == RESCUE_TYPES.GROUND)
	{
		SetVehicleOnGroundProperly(vehicle);
	}
	
	// set livery
	SetVehicleLivery(vehicle, 1);

	// enable siren
	SetVehicleSiren(vehicle, true);

	// unload model from memory
	SetModelAsNoLongerNeeded(model);

	return vehicle;
}

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
	const vehicle = await createRescueVehicle(startPoint, rescueType);

	// handle vehicle creation failure
	if (vehicle == 0)
	{
		return;
	}

	const [personnelCreated, personnel] = await createRescuePersonnel(vehicle, rescueType);

	// handle personnel creation failure
	if (!personnelCreated)
	{
		return;
	}
}