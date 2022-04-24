/// <reference path="node_modules/@citizenfx/client/index.d.ts"/>

/*
	GET POINTS STAGE

	Determine the start, end and delivery points for the rescue
*/

/**
 * Height offset above target position needed to rappel down
 */
const RESCUE_RAPPEL_HEIGHT = 10.0;

/**
 * Get closest hospital to position
 * @param {number[]} pos 
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
* Get start point for rescue
* @param {[number, number, number]} pos player position
* @returns {[number, number, number, number]} start point
*/
function getStartPoint(pos)
{
   // get random point offset
   const randomPoint = getVector2RandomOffset(pos, RESCUE_SPAWN_DIST);
   // get closest node from random point offset
   const [nodeFound, node, nodeHeading] = getVector2ClosestVehicleNode(randomPoint, true);
   
   if (nodeFound)
   {
	   return [node[0], node[1], node[2], nodeHeading];
   }

   // get heightmap bottom
   const bottom = GetHeightmapBottomZForPosition(randomPoint[0], randomPoint[1]);

   return [randomPoint[0], randomPoint[1], bottom, 0.0];
}

/**
* Get delivery point for rescue
* @param {[number, number, number]} pos player position
* @returns {[number, number, number]} delivery point
*/
function getDeliveryPoint(pos)
{
   // get closest hospital
   const closestHospital = getClosestHospital(pos);
   // calc random point
   const randomPoint = getVector2Random(pos, closestHospital, 0.2, 0.5);
   // get closest node from random point
   const [nodeFound, node] = getVector2ClosestVehicleNode(randomPoint);

   if (nodeFound)
   {
	   return [node[0], node[1], node[2]];
   }

   // get heightmap bottom
   const bottom = GetHeightmapBottomZForPosition(randomPoint[0], randomPoint[1]);

   return [randomPoint[0], randomPoint[1], bottom];
}

/**
* Get end point for rescue
* @param {[number, number, number]} pos player position
* @returns {[number, number, number]} end point
*/
function getEndPoint(pos)
{
   // get closest node from player position
   const [nodeFound, node] = getVector2ClosestVehicleNode(pos);
   
   if (nodeFound)
   {
	   const dist = getVector2Distance(pos, node);

	   // ensure vehicle node is close enough to player
	   if (dist < RESCUE_NODE_DIST)
	   {
		   return [node[0], node[1], node[2]];
	   }		
   }

   return [pos[0], pos[1], pos[2]];
}

function onStageBegin()
{
	// -----------------------------------------------------
	// prepare key positions needed for rescue

	// calc delivery point
	const deliveryPoint = getDeliveryPoint(pos);
	// calc start point
	const startPoint = getStartPoint(pos);
	// calc end point
	const endPoint = getEndPoint(pos);

	// offset points for air
	if (rescueType == RESCUE_TYPES.AIR)
	{
		// use exact player x,y,z
		endPoint[0] = pos[0];
		endPoint[1] = pos[1];
		endPoint[2] = pos[2];

		// ensure points are in the air
		deliveryPoint[2] += RESCUE_RAPPEL_HEIGHT;
		startPoint[2] += RESCUE_RAPPEL_HEIGHT;
		endPoint[2] += RESCUE_RAPPEL_HEIGHT;

		// point vehicle towards end point
		startPoint[3] = GetHeadingFromVector_2d(endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]);
	}
}