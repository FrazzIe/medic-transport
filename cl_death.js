/*
	Override management of player deaths
*/

/**
 * Event listener called when a resource has been started
 * @param {string} resource name of resource
 */
function resourceStarted(resource)
{

}

/**
 * Init event listeners & vars
 */
function init()
{
	on("onClientResourceStart", resourceStarted);
}

init();