/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	Manage player rescue
*/

/**
 * Try to rescue a downed player and bring them to the hospital for revival
 */
async function startRescue()
{
	// TODO	
}

/**
 * Listen for a players death
 */
function onPlayerDeath()
{
	// TODO
}

/**
 * Init event listeners & vars
 */
function init()
{
	on("playerDead", onPlayerDeath);
}

init();

RegisterCommand("meep", (src, args, raw) =>
{
	startRescue();
});