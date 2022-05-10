/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>
/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	Contains shared safety definitions & functions
*/

/**
 * The number of seconds an entity must be non-existant before forcing a timeout
 */
const ENTITY_EXIST_TIMEOUT = 60;

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

		// call runtime specific checks
		entityDuplicityCheck(ent);

		await delay(1000);
	}
}