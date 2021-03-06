/*
	Client utility functions
*/

/**
 * Miles per hour offset
 */
const MPH_OFFSET = 2.236936;

/**
 * Clamp number between two values
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function clamp(value, min, max)
{
	if (value > min)
	{
		if (value < max) 
		{
			return value;
		}

		return max;
	}

	return min;
}

/**
 * Get current seat index of ped in vehicle
 * 
 * Returns -2 on failure
 * 
 * @param {number} ped ped index
 * @param {number} vehicle vehicle index
 */
function getPedVehicleSeat(ped, vehicle)
{
	const numPassengers = GetVehicleMaxNumberOfPassengers(vehicle);

	for (let i = -1; i < numPassengers; i++)
	{
		// skip unoccupied seats
		if (IsVehicleSeatFree(vehicle, i))
		{
			continue;
		}

		const passenger = GetPedInVehicleSeat(vehicle, i);

		// found ped?
		if (ped == passenger)
		{
			return i;
		}
	}
	
	return -2;
}

/**
 * Get random number between min (inclusive) and max (exclusive)
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function getRandom(min, max)
{
	return Math.random() * (max - min) + min;
}

/**
 * Get random vector2 between two points
 * 
 * @param {Array<number>} x vector2 array
 * @param {Array<number>} y vector2 array
 * @param {number} [min] between 0.0 and 0.99
 * @param {number} [max] between 0.01 and 1.0
 */
function getVector2Random(x, y, min = 0.0, max = 1.0)
{
	// clamp mix / max
	min = clamp(min, 0.0, 0.99);
	max = clamp(max, min, 1.0);

	// get random
	const random = getRandom(min, max);

	// y - x
	const yx = [ y[0] - x[0], y[1] - x[1] ];
	// get length of yx
	const yxLength = ( yx[0] * yx[0] + yx[1] * yx[1] ) ** 0.5;
	// get normal of yx
	const yxNormal = [ yx[0] / yxLength, yx[1] / yxLength ];
	// calc random offset
	const yxRandom = [ random * yx[0], random * yx[1] ];

	return [ x[0] + yxRandom[0], x[1] + yxRandom[1] ];
}

/**
 * Calculate the distance between two vector2's
 */
function getVector2Distance(x, y)
{
	// y - x
	const yx = [ y[0] - x[0], y[1] - x[1] ];
	// dot product of yx
	const yxDot = yx[0] * yx[0] + yx[1] * yx[1];
	
	return yxDot ** 0.5;
}

/**
 * Get random point offset from point
 * @param {[number, number]} point
 */
function getVector2RandomOffset(point, offset = 1.0)
{
	/*
		E          A          F
		           |
		           |
		           |
		D ---------+--------- B
		           |
		           |
		           |
		H          C          G
	*/
	const points = 
	[
		[ point[0], point[1] + offset ], // A
		[ point[0] + offset, point[1] ], // B
		[ point[0], point[1] - offset ], // C
		[ point[0] - offset, point[1] ], // D
		
		[ point[0] - offset, point[1] + offset ], // E
		[ point[0] + offset, point[1] + offset ], // F
		[ point[0] + offset, point[1] - offset ], // G
		[ point[0] - offset, point[1] - offset ], // H
	];

	const random = Math.floor(Math.random() * points.length);

	return points[random];
}

/**
 * Calculate the closest vehicle node for vector2
 * @param {[number, number]} point vector2
 * @param {boolean} [getHeading] get node with heading
 * @returns {[boolean, [ number, number, number ], number]}
 */
function getVector2ClosestVehicleNode(point, getHeading = false)
{
	// get heightmap bottom
	const bottom = GetHeightmapBottomZForPosition(point[0], point[1]);

	// is heading needed?
	if (getHeading)
	{
		// get node w/ heading
		return GetClosestVehicleNodeWithHeading(point[0], point[1], bottom, 1, 3.0, 0);
	}

	// get node
	const [found, node] = GetClosestVehicleNode(point[0], point[1], bottom, 1, 3.0, 0);

	return [found, node, 0.0];	
}

/**
 * Cast a ray to a point to get intersect
 * @param {[number, number, number]} from start vector
 * @param {[number, number, number]} to end vector
 * @param {number} [ignore] entity to ignore
 * @param {number} [flags] intersection bit flags
 * @returns {[number, boolean, [ number, number, number ], [ number, number, number ], number, number]} result
 */
async function raycast(from, to, ignore = null, flags = -1)
{
	const handle = StartShapeTestLosProbe(from[0], from[1], from[2], to[0], to[1], to[2], flags, ignore, 0);
	let result = GetShapeTestResultIncludingMaterial(handle);

	do
	{
		result = GetShapeTestResultIncludingMaterial(handle);

		await delay(0);
	}
	while (result[0] == 1);

	return result;
}

/**
 * Number of miliseconds to wait before giving up on model load
 */
const LOAD_MODEL_TIMEOUT = 10000;

/**
 * Load a model into memory
 * @param {string | number} model 
 * @returns {boolean} success
 */
async function loadModel(model)
{
	// check if model is valid
	if (!IsModelInCdimage(model))
	{
		return false;
	}

	// request model
	RequestModel(model);

	const timeout = GetGameTimer() + LOAD_MODEL_TIMEOUT;

	// wait for model to load
	while (!HasModelLoaded(model) && GetGameTimer() < timeout)
	{
		await delay(0);
	}

	return HasModelLoaded(model);
}