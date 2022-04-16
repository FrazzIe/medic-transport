/**
 * Listen for a players death
 */
function onPlayerDeath()
{
	
}

/**
 * Init event listeners & vars
 */
function init()
{
	on("playerDead", onPlayerDead);
}

init();