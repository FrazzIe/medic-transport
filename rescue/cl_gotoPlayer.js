/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	GOTO_PLAYER RESCUE STAGE

	Manage AI and ensure they get to the player unharmed
*/

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