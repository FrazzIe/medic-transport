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
		{ dict: "dead", anim: "dead_a", flag: 1 },
		{ dict: "dead", anim: "dead_b", flag: 1 },
		{ dict: "dead", anim: "dead_c", flag: 1 },
		{ dict: "dead", anim: "dead_d", flag: 1 },
		{ dict: "dead", anim: "dead_e", flag: 1 },
		{ dict: "dead", anim: "dead_f", flag: 1 },
		{ dict: "dead", anim: "dead_g", flag: 1 },
		{ dict: "dead", anim: "dead_h", flag: 1 },
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
let playerDeathAnimations;

/**
 * Get death animation for situation
 * @returns {object | undefined} animation
 */
function getDeathAnimation()
{
	if (playerDeathAnimations == null)
	{
		return;
	}

	const ped = PlayerPedId();
	const vehicle = GetVehiclePedIsIn(ped, false);

	if (vehicle != 0)
	{
		return playerDeathAnimations.vehicle;
	}

	if (IsPedSwimming(ped))
	{
		return playerDeathAnimations.water;
	}

	return playerDeathAnimations.player;
}

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

	const animation = getDeathAnimation();

	// prevent running if animation not available
	if (animation == null)
	{
		return;
	}

	// load animation if not available
	if (!HasAnimDictLoaded(animation.dict))
	{
		RequestAnimDict(animation.dict);

		while (!HasAnimDictLoaded(animation.dict))
		{
			await delay(0);
		}
	}

	const ped = PlayerPedId();

	// floating to surface
	// credit: https://github.com/jameslroll
	if (IsPedSwimmingUnderWater(ped))
	{
		const [x, y] = GetEntityVelocity(ped);

		SetEntityVelocity(ped, x, y, WATER_BUOYANCY);
	}

	// don't play animation if already playing
	if (IsEntityPlayingAnim(ped, animation.dict, animation.anim, 3))
	{
		return;
	}

	TaskPlayAnim(ped, animation.dict, animation.anim, 2.0, 1.0, -1, animation.flag, 0.0, false, false, false);
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

	// get random animations for death
	playerDeathAnimations =
	{
		player: deathAnimations.player[Math.floor(Math.random() * deathAnimations.player.length)],
		vehicle: deathAnimations.vehicle[Math.floor(Math.random() * deathAnimations.vehicle.length)],
		water: deathAnimations.water[Math.floor(Math.random() * deathAnimations.water.length)]
	};

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