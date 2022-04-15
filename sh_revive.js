/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Revive handler
*/

/**
 * Client-side event listener called when a player is to be revived
 */
function onRevivePlayer()
{

}

/**
 * Server-side event listener called when a player is to be revived 
 */
function onNetRevivePlayer()
{

}

/**
 * Init event listeners & vars
 */
function init()
{
	onNet("revivePlayer", IsDuplicityVersion() ? onNetRevivePlayer : onRevivePlayer);
}