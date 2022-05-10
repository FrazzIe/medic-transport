/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	PED EXIT VEHICLE STAGE

	Ensure all peds exit the vehicle
*/

/**
 * Make ped exit vehicle
 * @param {number} pedNetId ped network id
 * @param {number} vehicleNetId vehicle network id
 * @param {number} seatIndex ped seat index
 * @returns {bool}
 */
async function pedExitVehicle(pedNetId, vehicleNetId, seatIndex)
{
	while (true)
	{
		// get ped & vehicle handles
		const ped = NetworkGetEntityFromNetworkId(netId);
		const vehicle = NetworkGetEntityFromNetworkId(netId);

		// skip non-existant entities
		// safety check will catch this
		if (!DoesEntityExist(ped) || !DoesEntityExist(vehicle))
		{
			continue;
		}

		// TODO: Exit vehicle

		await delay(0);
	}
}

/**
 * Initiate stage
 * @param {object} rescue
 * @param {number | string} src   
 */
async function onStageInit(rescue, src)
{
	// ped tasks collection
	const tasks = [];

	// safety check collection
	const checks = [];

	// promise info
	// used to cancel remaining promises
	const info = { cancel: false };

	// create promises

	// vehicle safety check
	checks[checks.length] = entitySafetyCheck(rescue.vehicle, info);

	for (let i = 0; i < rescue.peds.length; i++)
	{
		// ped safety check
		checks[checks.length] = entitySafetyCheck(rescue.peds[i], info);

		// ped exit task
		tasks[tasks.length] = pedExitVehicle(rescue.peds[i], rescue.vehicle, i - 1);
	}

	try
	{
		const p = await Promise.race([Promise.all(tasks), ...checks]);
	}
	catch(err)
	{
		console.info(err.message);
	}
}

/**
 * Init event listeners & vars
 */
function init()
{
	// add stage to stage func map
	RESCUE_FUNCTION_INIT[RESCUE_STAGE.PED_EXIT_VEHICLE] = onStageInit;
}

init();