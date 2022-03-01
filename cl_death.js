/// <reference path="./node_modules/@citizenfx/client"/>

/*
	Manage player deaths
*/

const deathAnimations =
[
	{ dict = "missarmenian2", anim = "drunk_loop", flag = 129 },
	{ dict = "random@mugging4", anim = "flee_backward_loop_shopkeeper", flag = 129 },
];
let playerDead;

/**
 * Handle player death after respawn
 */
function onPlayerRespawned()
{
	playerDead = true;

	const player = PlayerId();

	// set player invincible
	SetPlayerInvincibleKeepRagdollEnabled(player, true);
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