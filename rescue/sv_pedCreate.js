/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	PED CREATE STAGE

	Create ped for rescue
*/

/**
 * Number of miliseconds to wait before giving up on ped creation
 */
const CREATE_PED_TIMEOUT = 15000;

/**
 * Create a ped inside a vehicle
 * @param {string | number} model 
 * @param {number} vehicle 
 * @param {number} seat 
 * @returns {Promise}
 */
function createPedInVehicle(model, vehicle, seat)
{
	return new Promise(async (resolve, reject) => 
	{
		const ped = CreatePedInsideVehicle(vehicle, 4, model, seat, true, false);

		const timeout = GetGameTimer() + CREATE_PED_TIMEOUT;
	
		// wait for ped to be created
		while (!DoesEntityExist(ped) && GetGameTimer() < timeout)
		{
			await delay(0);
		}
	
		// handle creation failure
		if (!DoesEntityExist(ped))
		{
			reject(0);
		}

		// increase ped culling distance
		// TODO: relook at this
		SetEntityDistanceCullingRadius(ped, RESCUE_SPAWN_DIST * 10);

		// return ped network id
		resolve(NetworkGetNetworkIdFromEntity(ped));
	});
}

/**
 * Initiate stage
 * @param {object} rescue
 * @param {number | string} src   
 */
async function onStageInit(rescue, src)
{
	// get vehicle entity
	const vehicle = NetworkGetEntityFromNetworkId(rescue.vehicle);
	// ped creation promises
	const peds = [];

	// create driver / pilot
	peds[peds.length] = createPedInVehicle(RESCUE_DRIVER[rescue.type], vehicle, -1);

	// get passenger info
	const passengerInfo = RESCUE_PASSENGER[rescue.type];

	// create passengers
	for (let i = 0; i < passengerInfo.count; i++)
	{
		peds[peds.length] = createPedInVehicle(passengerInfo.model, vehicle, passengerInfo.seat + i);
	}

	// collect all ped network ids	
	let netIds;

	try
	{
		netIds = await Promise.all(peds);
	}
	catch
	{
		netIds = [];
	}

	// end stage
	// send ped ids
	emit("rescueStage", { netIds }, src);
}

/**
 * Handle stage result payload
 * @param {object} rescue
 * @param {object} payload
 */
function onStageResult(rescue, payload)
{
	// set failed status on invalid id collection
	if (payload.netIds == null || payload.netIds.length == 0)
	{
		rescue.status = RESCUE_STATUS.FAILED;
		return;
	}

	// ensure all network ids are valid
	for (let i = 0; i < payload.netIds.length; i++)
	{
		// is network id invalid?
		if (payload.netIds[i] == 0)
		{
			rescue.status = RESCUE_STATUS.FAILED;
			return;
		}
	}

	// assign ped network ids
	rescue.peds = payload.netIds;
}

/**
 * Init event listeners & vars
 */
function init()
{
	// add stage to stage func map
	RESCUE_FUNCTION_INIT[RESCUE_STAGE.PED_CREATE] = onStageInit;
	RESCUE_FUNCTION_RESULT[RESCUE_STAGE.PED_CREATE] = onStageResult;
}

init();