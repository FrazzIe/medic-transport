/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Revive handler
*/

/**
 * Event listener called when a player is to be revived
 */
function onRevivePlayer()
{

}

/**
 * Init event listeners & vars
 */
function init()
{
	onNet("revivePlayer", onRevivePlayer);
}