const HOSPITAL =
{
	DOWNT: [ 340.73138427734375, -560.0415649414062, 28.7437744140625 ],
	ROCKF: [ -492.00555419921875, -336.81109619140625, 34.37325668334961 ],
	DAVIS: [ 298.5017395019531, -1442.3079833984375, 29.796716690063477 ],
	EBURO: [ 1153.375244140625, -1512.349365234375, 34.6925163269043 ],
	SANDY: [ 1827.2783203125, 3693.526123046875, 34.224239349365234 ],
	PALETO: [ -237.30364990234375, 6332.01171875, 32.40016174316406 ]
}

/**
 * Get closest hospital to position
 */
function getClosestHospital(pos)
{
	
}

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
	on("playerDead", onPlayerDeath);
}

init();