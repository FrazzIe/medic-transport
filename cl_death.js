/// <reference path="./node_modules/@citizenfx/client"/>

/*
	Manage player deaths
*/

let playerDead;

/**
 * Handle player death after respawn
 */
function onPlayerRespawned()
{
	playerDead = true;

}

/**
 * Init event listeners & vars
 */
function init()
{
	playerDead = false;

	on("playerRespawned", onPlayerRespawned);
}
 
init();