/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>
/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	Shared rescue specific variables and functions
*/

/**
 * Improvised Enum of available types of rescues
 */
const RESCUE_TYPE =
{
	NONE: "NONE",
	GROUND: "GROUND",
	AIR: "AIR"
};

/**
 * Improvided Enum of rescue status
 */
const RESCUE_STATUS =
{
	FAILED: "FAILED",
	ONGOING: "ONGOING",
	COMPLETE: "COMPLETE"
};

/**
 * Improvided Enum of rescue stages
 */
const RESCUE_STAGE =
{
	GET_TYPE: "GET_TYPE",
	GET_POINTS: "GET_POINTS",
	AI_CREATE: "AI_CREATE",
	AI_GOTO_POINT: "AI_GOTO_POINT",
	AI_ENTER_VEHICLE: "AI_ENTER_VEHICLE",
	AI_EXIT_VEHICLE: "AI_EXIT_VEHICLE",
	AI_RAPPEL_VEHICLE: "AI_RAPPEL_VEHICLE",
	AI_ATTACH_OBJECT: "AI_ATTACH_OBJECT",
	VEHICLE_CREATE: "VEHICLE_CREATE",
	VEHICLE_GOTO_POINT: "VEHICLE_GOTO_POINT",
	VEHICLE_ATTACH_OBJECT: "VEHICLE_ATTACH_OBJECT",
	OBJECT_CREATE: "OBJECT_CREATE",
	OBJECT_ATTACH_PLAYER: "OBJECT_ATTACH_PLAYER"
};