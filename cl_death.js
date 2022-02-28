/// <reference path="./node_modules/@citizenfx/client"/>

/*
	Manage player deaths
*/

/**
 * Handle player death after respawn
 */
function onPlayerRespawned()
{

}

/**
 * Init event listeners & vars
 */
function init()
{
	on("playerRespawned", onPlayerRespawned);
}
 
init();