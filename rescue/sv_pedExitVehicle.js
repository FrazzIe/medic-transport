/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	PED EXIT VEHICLE STAGE

	Ensure all peds exit the vehicle
*/

/**
 * No script task is assigned to ped
 * 0x811E343C to signed int, used with GetPedScriptTaskCommand
 */
const PED_TASK_NONE = -2128726980;

/**
 * Unknown task handle, seems to be related with vehicle exiting?
 * 0xB167044D to signed int, used with GetPedScriptTaskCommand
 */
const PED_TASK_UNK = -1318648755;

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
		const ped = NetworkGetEntityFromNetworkId(pedNetId);
		const vehicle = NetworkGetEntityFromNetworkId(vehicleNetId);

		// skip non-existant entities
		// safety check will catch this
		if (!DoesEntityExist(ped) || !DoesEntityExist(vehicle))
		{
			continue;
		}
		
		// check if ped is no longer in vehicle
		if (GetPedInVehicleSeat(vehicle, seatIndex) != ped && GetLastPedInVehicleSeat(vehicle, seatIndex) == ped)
		{
			return true;
		}

		// get peds current task
		const task = GetPedScriptTaskCommand(ped);

		// exit vehicle if no task is running
		if (task == PED_TASK_NONE)
		{
			// leave vehicle
			TaskLeaveAnyVehicle(ped, 0, 0);
		}
		// clear tasks if not unk
		else if (task != PED_TASK_UNK)
		{
			ClearPedTasks(ped);
		}

		console.log(`current task command ${task} -> ${GetPedScriptTaskCommand(ped)}`);

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