/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Revive handler
*/

/**
 * Handle player revival
 */
function onPlayerRevived()
{
	const ped = PlayerPedId();

	ClearPedBloodDamage(ped);
}

/**
 * Init event listeners & vars
 */
function init()
{
	onNet("playerRevived", onPlayerRevived);
}

init();