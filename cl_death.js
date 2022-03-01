/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Manage player deaths
*/

const deathAnimations =
{
	player:
	[
		{ dict: "missarmenian2", anim: "drunk_loop", flag: 129 },
		{ dict: "random@mugging4", anim: "flee_backward_loop_shopkeeper", flag: 129 },
	],
	vehicle:
	[
		{ dict: "veh@std@rps@idle_duck", anim: "sit", flag: 16 }
	],
	water:
	[
		{ dict: "dam_ko", anim: "drown", flag: 1 }
	]
};
const disabledControls =
{	
	INPUT_SPRINT: 21,
	INPUT_JUMP: 22,
	INPUT_ENTER: 32,
	INPUT_ATTACK: 24,
	INPUT_MOVE_LR: 30,
	INPUT_MOVE_UD: 31,
	INPUT_DUCK: 36,
	INPUT_VEH_MOVE_LR: 59,
	INPUT_VEH_MOVE_UD: 60,
	INPUT_VEH_DUCK: 73,
	INPUT_VEH_EXIT: 75
};

let playerDead;
let playerDeadTick;
let playerAnimation;

/**
 * Ticker ran every frame when a player is dead
 */
async function onPlayerDeadTick()
{
	// disable player controls
	for (name in disabledControls)
	{
		DisableControlAction(2, disabledControls[name], true);
	}

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