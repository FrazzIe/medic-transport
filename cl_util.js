/**
 * 
 * Waits a minimum amount of time, note that this can be longer, but
 * it is guaranteed to be atleast the specified amount of time
 *  
 * Functions that use delay must be declared async.
 * 
 * @param {int} ms 
 * @returns {Promise} promise
 */
function delay(ms)
{
	return new Promise(res => setTimeout(res, ms));
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
 * @param {number} min between 0.0 and 0.99
 */
function getVector2Random(x, y, min = 0.0)
{
	// get random
	const random = getRandom(min, 1.0);
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