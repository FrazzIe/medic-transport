/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	VEHICLE GOTO POINT STAGE

	Move vehicle to point
*/

/**
 * Speed at which vehicles go when travelling to a point
 * 
 * MPH
 */
const RESCUE_VEHICLE_SPEED =
{
	GROUND: 55,
	AIR: 90
}

/**
 * Styles of driving used by rescue vehicle drivers
 */
const RESCUE_VEHICLE_STYLE = 
{
	GROUND: 262148,
	AIR: 262144
}

function onStageBegin()
{
	// get vehicle driver
	const driver = personnel[0];
	// get vehicle travelling speed
	const speed = RESCUE_VEHICLE_SPEED[rescueType] / MPH_OFFSET;
	// get vehicle model
	const model = RESCUE_VEHICLE[rescueType];
	// get driving style
	const style = RESCUE_VEHICLE_STYLE[rescueType];

	// drive vehicle to point
	TaskVehicleDriveToCoord(driver, vehicle, endPoint[0], endPoint[1], endPoint[2], speed, 0, model, style, RESCUE_VEHICLE_STOP_RANGE, 0.0);
}