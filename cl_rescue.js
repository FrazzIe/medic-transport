const RESCUE_HOSPITALS =
[
	[ 340.73, -560.04, 28.74 ],   // DOWNT
	[ -492.00, -336.81, 34.37 ],  // ROCKF
	[ 298.50, -1442.30, 29.79 ],  // DAVIS
	[ 1153.37, -1512.34, 34.69 ], // EBURO
	[ 1827.27, 3693.52, 34.22 ],  // SANDY
	[ -237.30, 6332.01, 32.40 ]   // PALETO
]

/**
 * Get closest hospital to position
 */
function getClosestHospital(pos)
{
	let closest = RESCUE_HOSPITALS[0];
	let closestDist = getVector2Distance(pos, closest);

	for (let i = 1; i < RESCUE_HOSPITALS.length; i++)
	{
		const hospital = RESCUE_HOSPITALS[i];
		const dist = getVector2Distance(pos, hospital);

		if (dist < closestDist)
		{
			closest = hospital;
			closestDist = dist;
		}
	}

	return closest;
}

/**
 * Listen for a players death
 */
function onPlayerDeath()
{
	const ped = PlayerPedId();
	const pos = GetEntityCoords(ped);

	// get closest hospital
	const closestHospital = getClosestHospital(pos);
	// calc delivery point
	const deliveryPoint = getVector2Random(pos, closestHospital, 0.5);


}

/**
 * Init event listeners & vars
 */
function init()
{
	on("playerDead", onPlayerDeath);
}

init();