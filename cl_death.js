/// <reference path="./node_modules/@citizenfx/client"/>

/*
	Override management of player deaths
*/
const SPAWN_MANAGER_RESOURCE = "spawnmanager";

let playerSpawned;

/**
 * Handle player spawning
 */
function spawnPlayer()
{

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