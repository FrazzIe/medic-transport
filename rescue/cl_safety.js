/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Contains safety functions used
	to ensure specifc conditions are met
*/

/**
 * Perform runtime specific entity checks within entitySafetyCheck
 * @param {number} ent entity handle
 */
function entityDuplicityCheck(ent)
{
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
}