/*
	Configurable rescue options
*/

/**
 * List of hospital delivery locations
 */
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
 * List of zones that are unreachable
 */
const RESCUE_ZONE_BLACKLIST = [ "ARMYB", "JAIL" ];

/**
 * List of zones that can only be reached by air
 */
const RESCUE_ZONE_AIR = [ "PALCOV", "OCEANA" ];

/**
 * List of interior hashes that are reachable
 */
const RESCUE_INTERIOR_WHITELIST =
[
	1847849587, // AIRPORT HANGAR
	1932111343, // ROGERS SALVAGE & SCRAP
	-1760196495, // BARBER SHOP
	-1738793216, // AMMU-NATION SMALL
	-26658153, // AMMU-NATION BIG
	371397885, // MAZEBANK GARAGE 01
	-1710765799, // MAZEBANK GARAGE 02
	1753457757, // BINCO CLOTHING
	225974099, // SUBURBAN CLOTHING
	-1690750853, // 24/7 STORE
	-945079088, // ROCKFORD PLAZA
	-429983331, // PACIFIC STANDARD BANK
	1338737678, // FLEECA BANK
	607268480, // BLAINE COUNTY SAVINGS BANK
	-1716756720, // ICE PLANET JEWELRY
	1457285595, // TEQUI-LA-LA
	-298980389, // PONSONBYS
	1724779208, // DEL PERRO BEACH APT.
	-1407739860, // MISSION ROW POLICE DEPARTMENT
	-371481864, // PALETO SHERIFFS OFFICE
	-400174009, // SANDY SHERIFFS OFFICE
	-89256394, // LS CUSTOMS 01
	100117129, // LS CUSTOMS 02
	-1070602979, // LS CUSTOMS 03
	299191145, // BENNY'S ORIGINAL MOTORWORKS
	1314234446, // VANILLA UNICORN
	-1480564353, // TATTOO SHOP
	-1437859694, // PALETO TUNNEL 01
	560393926, // PALETO TUNNEL 02
	249579961, // PALETO TUNNEL 03
	2136268782, // STRAWBERRY TUNNEL 01
	260467921, // STRAWBERRY TUNNEL 02
	-1935705469, // STRAWBERRY TUNNEL 03
	604839936, // UNION DEPOSITORY
	-1514137385, // UNDERGROUND PARKING
	// VANGELICO JEWELRY
	// SWEAT SHOP
	// PREMIUM DELUXE MOTORSPORT
];

/**
 * How far away a rescue should be spawned from death location
 * 
 * GTA Metres
 */
const RESCUE_SPAWN_DIST = 300.0;

/**
 * Available rescue vehicles for each rescue type
 */
const RESCUE_VEHICLE =
{
	GROUND: "ambulance",
	AIR: "polmav"
};

/**
 * Available rescue drivers for each rescue type
 */
const RESCUE_DRIVER =
{
	GROUND: "s_m_m_paramedic_01",
	AIR: "s_m_m_pilot_02"
};

/**
 * Available rescue passengers for each rescue type
 */
const RESCUE_PASSENGER = 
{
	GROUND: 
	{
		model: "s_m_m_paramedic_01",
		seat: 0,
		count: 1
	},
	AIR:
	{
		model: "s_m_m_paramedic_01",
		seat: 1,
		count: 2
	}
};