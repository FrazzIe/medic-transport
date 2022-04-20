/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	Manage player deaths
*/

const deaths = {};

/**
 * Listen for a players death
 */
function onPlayerDeath()
{
	const src = global.source;

	deaths[src] = true;

	// set player dead
	emitNet("playerDead", src);
}

/**
 * Init event listeners & vars
 */
function init()
{
	on("playerDead", onPlayerDeath);
}