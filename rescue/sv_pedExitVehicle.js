/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	PED EXIT VEHICLE STAGE

	Ensure all peds exit the vehicle
*/

/**
 * Make ped exit vehicle
 * @param {number} pedNetId 
 * @param {number} vehicleNetId 
 * @returns {bool}
 */
async function pedExitVehicle(pedNetId, vehicleNetId)
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