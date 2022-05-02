/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	PED CREATE STAGE

	Customise pilot after creation
*/

function onStageCustomise(rescue, netId)
{
	const ped = NetworkGetEntityFromNetworkId(netId);

	if (!DoesEntityExist(ped))
	{
		return;
	}

	// give pilot helmet
	GivePedHelmet(ped, true, 1, 65536);
}

/**
 * Init event listeners & vars
 */
function init()
{
	onNet("rescueCustomisePilot", onStageCustomise);
}

init();