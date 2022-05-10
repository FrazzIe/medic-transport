/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Contains safety functions used
	to ensure specifc conditions are met
*/

/**
 * Performs safety checks to ensure the rescue entity is viable
 * @param {number} netId entity network id
 * @param {object} info
 * @param {boolean} info.cancel should promise be cancelled
 */
async function entitySafetyCheck(netId, info)
{
	let timeout = 0;

	while (true)
	{
		console.info(`Safety check for ${netId}, ${info.cancel}`);

		if (info.cancel)
		{
			return;
		}

		const ent = NetworkGetEntityFromNetworkId(netId);

		// entity exist?
		if (!DoesEntityExist(ent))
		{
			// inc timeout
			timeout++;

			// has entity reached timeout threshold
			if (timeout >= ENTITY_EXIST_TIMEOUT)
			{
				throw new Error(`Entity exist timeout reached for network id: ${netId}`);
			}

			// skip further checks
			continue;
		}

		// reset timeout
		timeout = 0;

		// is entity dead
		if (IsEntityDead(ent))
		{
			throw new Error(`Entity with network id ${netId} has died`);
		}

		// vehicle specific checks
		if (IsEntityAVehicle(ent))
		{
			// check if vehicle has somehow flipped
			if (IsVehicleStuckOnRoof(ent))
			{
				throw new Error(`Entity with network id ${netId} has flipped`);
			}
		}

		// ped specific checks
		if (IsEntityAPed(ent))
		{
			// ensure ped is in a vehicle
			if (!IsPedSittingInAnyVehicle(ent))
			{
				throw new Error(`Entity with network id ${netId} isn't in a vehicle`);
			}
		}

		await delay(1000);
	}
}