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

	const playerId = PlayerId();

	// set player invincible
	SetPlayerInvincibleKeepRagdollEnabled(playerId, true);
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