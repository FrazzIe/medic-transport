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