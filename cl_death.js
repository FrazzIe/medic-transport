/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Manage player deaths
*/

const deathAnimations =
[
	{ dict = "missarmenian2", anim = "drunk_loop", flag = 129 },
	{ dict = "random@mugging4", anim = "flee_backward_loop_shopkeeper", flag = 129 },
];
let playerDead;
let playerDeadTick;

/**
 * Ticker ran every frame when a player is dead
 */
function onPlayerDeadTick()
{
	// TODO
}

/**
 * Handle player death after respawn
 */
function onPlayerRespawned()
{
	playerDead = true;

	const player = PlayerId();

	// set player invincible
	SetPlayerInvincibleKeepRagdollEnabled(player, true);

	playerDeadTick = setTick(onPlayerDeadTick);

	emit("playerDead");
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