/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Revive handler
*/

/**
 * Event listener called when a player is to be revived
 * @param {string | number | null} target
 */
function onRevivePlayer(target)
{
	if (target == null)
	{
		return;
	}

	// revive player
	emitNet("playerRevived", target);
}

/**
 * Init event listeners & vars
 */
function init()
{
	on("revivePlayer", onRevivePlayer);
}

init();