/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Contains safety functions used
	to ensure specifc conditions are met
*/

/**
 * The number of seconds an entity must be non-existant before forcing a timeout
 */
const ENTITY_EXIST_TIMEOUT = 60;

/**
 * Performs safety checks to ensure the rescue entity is viable
 * @param {number} netId entity network id
 */
function entitySafetyCheck(netId)
{
	return new Promise(async (resolve, reject) => 
	{
		let timeout = 0;

		while (true)
		{
			const ent = NetworkGetEntityFromNetworkId(netId);

			// entity exist?
			if (!DoesEntityExist(ent))
			{
				// inc timeout
				timeout++;

				// has entity reached timeout threshold
				if (timeout >= ENTITY_EXIST_TIMEOUT)
				{
					reject();
				}

				// skip further checks
				continue;
			}

			// reset timeout
			timeout = 0;

			// is ped dead
			if (IsEntityDead(ent))
			{
				reject();
			}

			await delay(1000);
		}
	});
}