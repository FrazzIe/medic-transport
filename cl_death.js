/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Manage player deaths
*/

const deathAnimations =
[
	{ dict: "missarmenian2", anim: "drunk_loop", flag: 129 },
	{ dict: "random@mugging4", anim: "flee_backward_loop_shopkeeper", flag: 129 },
];
let playerDead;
let playerDeadTick;
let playerAnimation;

/**
 * Ticker ran every frame when a player is dead
 */
async function onPlayerDeadTick()
{
	// prevent running if animation not available
	if (playerAnimation == null)
	{
		return;
	}

	// load animation if not available
	if (!HasAnimDictLoaded(playerAnimation.dict))
	{
		RequestAnimDict(playerAnimation.dict);

		while (!HasAnimDictLoaded(playerAnimation.dict))
		{
			await delay(0);
		}
	}

	const ped = PlayerPedId();

	// don't play animation if already playing
	if (IsEntityPlayingAnim(ped, playerAnimation.dict, playerAnimation.anim, 3))
	{
		return;
	}

	TaskPlayAnim(ped, playerAnimation.dict, playerAnimation.anim, 2.0, 1.0, -1, playerAnimation.flag, 0.0, false, false, false);
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

	// get basic random animation
	playerAnimation = deathAnimations[Math.floor(Math.random() * deathAnimations.length)];

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