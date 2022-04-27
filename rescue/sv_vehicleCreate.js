/**
 * Initiate stage
 * @param {object} rescue
 * @param {number | string} src   
 */
function onStageInit(rescue, src)
{

}

/**
 * Init event listeners & vars
 */
function init()
{
	// add stage to stage func map
	RESCUE_FUNCTION[RESCUE_STAGE.VEHICLE_CREATE] = onStageInit;
}
  
init();