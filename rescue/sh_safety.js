/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>
/// <reference path="node_modules/@citizenfx/server/index.d.ts"/>

/*
	Contains shared safety definitions & functions
*/

/**
 * The number of seconds an entity must be non-existant before forcing a timeout
 */
const ENTITY_EXIST_TIMEOUT = 60;