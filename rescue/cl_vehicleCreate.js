/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	VEHICLE CREATE STAGE

	Customise vehicle after creation
*/

function onStageCustomise(rescue, netId)
{
	const vehicle = NetworkGetEntityFromNetworkId(netId);

	if (!DoesEntityExist(vehicle))
	{
		return;
	}

	// rescue type specific vehicle options
	if (rescue.type == RESCUE_TYPE.GROUND)
	{
		SetVehicleOnGroundProperly(vehicle);
	}
	
	// set livery
	SetVehicleLivery(vehicle, 1);

	// enable siren
	SetVehicleSiren(vehicle, true);
}

/**
 * Init event listeners & vars
 */
function init()
{
	onNet("rescueCustomise", onStageCustomise);
}

init();