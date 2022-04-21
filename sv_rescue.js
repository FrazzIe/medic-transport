/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	Manage player rescue
*/

/**
 * Listen for initiation of a player rescue
 * @param {number} rescueType 
 * @param {[number, number, number, number]} startPoint 
 * @param {[number, number, number]} endPoint 
 * @param {[number, number, number]} targetPoint 
 * @param {[number, number, number]} deliveryPoint 
 */
function onPlayerRescue(rescueType, startPoint, endPoint, targetPoint, deliveryPoint)
{
	const src = global.source;

}

/**
 * Init event listeners & vars
 */
function init()
{
	on("playerRescue", onPlayerRescue);
}