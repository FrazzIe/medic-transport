/*
	Override management of player deaths
*/
const SPAWN_MANAGER_RESOURCE = "spawnmanager";

/**
 * Handle player spawning
 */
function spawnPlayer()
{

}

/**
 * Event listener called when a resource has been started
 * @param {string} resource name of resource
 */
function resourceStarted(resource)
{
	if (resource != SPAWN_MANAGER_RESOURCE)
	{
		return;
	}

	// Override default player spawning
	exports[SPAWN_MANAGER_RESOURCE].setAutoSpawnCallback(spawnPlayer);
}

/**
 * Init event listeners & vars
 */
function init()
{
	on("onClientResourceStart", resourceStarted);
}

init();