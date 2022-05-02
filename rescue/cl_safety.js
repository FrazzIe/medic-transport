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
 * Performs safety checks to ensure the rescue peds are viable
 * @param {number[]} peds collection of ped net ids
 */
function pedSafetyCheck(peds)
{
	return new Promise(async (resolve, reject) => 
	{
		const timeouts = {};

		while (true)
		{
			for (let i = 0; i < peds; i++)
			{
				const netId = peds[i];
				const ped = NetworkGetEntityFromNetworkId(netId);

				// entity exist?
				if (!DoesEntityExist(ped))
				{
					// start exist timeout
					if (!timeouts[netId])
					{
						timeouts[netId] = 0;
					}

					// inc timeout
					timeouts[netId]++;

					// has entity reached timeout threshold
					if (timeouts[netId] >= ENTITY_EXIST_TIMEOUT)
					{
						reject();
					}

					// skip further checks
					continue;
				}

				// is ped dead
				if (IsEntityDead(ped))
				{
					reject();
				}

				await delay(1000);
			}
		}
	});
}