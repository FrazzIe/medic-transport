/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	Manage and track all rescues
*/

/**
 * Map of rescues
 * 
 * key: server id
 * value: rescue obj
 */
const rescues = {};

/**
 * Start a player rescue
 * 
 * Called externally from the server
 */
function onStartRescue(src)
{
	// prevent starting another rescue
	if (rescues[src] != null)
	{
		return;
	}

}

/**
 * Init event listeners & vars
 */
function init()
{
	// add rescuePlayer event listener
	on("rescuePlayer", onStartRescue);
}