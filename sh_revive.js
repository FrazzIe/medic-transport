/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Revive handler
*/

/**
 * Client-side event listener called when a player is to be revived
 */
function onRevivePlayer()
{
	const ped = PlayerPedId();

	ClearPedBloodDamage(ped);

	emit("playerRevived");
}

/**
 * Server-side event listener called when a player is to be revived 
 * @param {string | number | null} target 
 */
function onNetRevivePlayer(target)
{
	const src = global.source;

	// external permission check
	emit("canPlayerRevive", src, target ?? src);

	// prevent revive
	if (WasEventCanceled())
	{
		return;
	}

	// revive player
	emitNet("revivePlayer", target ?? src);
}

/**
 * Init event listeners & vars
 */
function init()
{
	onNet("revivePlayer", IsDuplicityVersion() ? onNetRevivePlayer : onRevivePlayer);
}