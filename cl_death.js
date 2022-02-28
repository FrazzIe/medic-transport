/// <reference path="./node_modules/@citizenfx/client"/>

/*
	Override management of player respawns
*/

const SPAWN_MANAGER_RESOURCE = "spawnmanager";

let playerSpawned;

/**
 * Handle player spawning
 */
async function spawnPlayer()
{
	// prevent reviving until the player is no longer moving
	while(IsPedFalling(PlayerPedId()) || IsPedRagdoll(PlayerPedId()))
	{
		await delay(0);
	}

	const ped = PlayerPedId();
	const [x, y, z] = GetEntityCoords(ped);
	const heading = GetEntityHeading(ped);

	// revive player
	SetEntityCoordsNoOffset(ped, x, y, z, false, false, false, true);
	NetworkResurrectLocalPlayer(x, y, z, heading, true, true, false);

	ClearPedTasksImmediately(ped);

	emit("playerRespawned");
}

/**
 * Event listener called when a player has spawned
 */
function onPlayerSpawned()
{
	playerSpawned = true;

	// Override default player spawning
	exports[SPAWN_MANAGER_RESOURCE].setAutoSpawnCallback(spawnPlayer);
}

/**
 * Event listener called when a resource has been started
 * @param {string} resource name of resource
 */
function onResourceStarted(resource)
{
	if (resource != SPAWN_MANAGER_RESOURCE)
	{
		return;
	}

	// ensure player has spawned at least once
	if (playerSpawned)
	{
		// Override default player spawning
		exports[SPAWN_MANAGER_RESOURCE].setAutoSpawnCallback(spawnPlayer);
	}
}

/**
 * Init event listeners & vars
 */
function init()
{
	playerSpawned = false;

	on("onClientResourceStart", onResourceStarted);
	on("playerSpawned", onPlayerSpawned);
}

init();