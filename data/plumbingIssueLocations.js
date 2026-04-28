/**
 * Plumbing Issue Locations - Areas where the plumber WORKS
 * These are the "work locations" - where the actual plumbing exists
 * e.g., "ceiling from upstairs bathroom" → upstairs bathroom is where plumber works
 */

export default [
  {
    "id": "bathroom",
    "aliases": ["bathroom", "restroom", "washroom", "upstairs bathroom", "downstairs bathroom", "outside bathroom", "guesthouse bathroom", "master bathroom", "half bathroom", "full bathroom", "main bathroom", "guest bathroom"],
    "category": "room",
    "description": "General bathroom area where plumbing fixtures are located"
  },
  {
    "id": "kitchen",
    "aliases": ["kitchen", "in the kitchen", "kitchen area", "main kitchen", "galley kitchen"],
    "category": "room",
    "description": "Kitchen room area with sinks, dishwashers, and water lines"
  },
  {
    "id": "basement",
    "aliases": ["basement", "in the basement", "downstairs basement", "cellar", "lower level"],
    "category": "room",
    "description": "Basement area with water heaters, main lines, and sump pumps"
  },
  {
    "id": "garage",
    "aliases": ["garage", "in the garage", "attached garage", "detached garage", "car garage"],
    "category": "room",
    "description": "Garage area with water heaters, hose bibs, or utility sinks"
  },
  {
    "id": "laundry_room",
    "aliases": ["laundry room", "laundry area", "utility room", "washer area", "dryer room"],
    "category": "room",
    "description": "Laundry room with washing machine hookups and drains"
  },
  {
    "id": "master_bedroom",
    "aliases": ["master bedroom", "master bath", "master suite", "ensuite bathroom"],
    "category": "room",
    "description": "Master bedroom area with ensuite bathroom"
  },
  {
    "id": "upstairs",
    "aliases": ["upstairs", "second floor", "upper floor", "upstairs area", "top floor"],
    "category": "floor",
    "description": "Upstairs floor containing bathrooms and plumbing"
  },
  {
    "id": "downstairs",
    "aliases": ["downstairs", "first floor", "main floor", "ground floor", "lower floor"],
    "category": "floor",
    "description": "Downstairs/main floor with kitchen and bathrooms"
  },
  {
    "id": "attic",
    "aliases": ["attic", "in the attic", "attic space", "roof space"],
    "category": "space",
    "description": "Attic area with vent pipes or potential leak points"
  },
  {
    "id": "crawl_space",
    "aliases": ["crawl space", "crawlspace", "under house", "underneath house"],
    "category": "space",
    "description": "Crawl space beneath house with pipes and potential leaks"
  },
  {
    "id": "exterior",
    "aliases": ["outside", "exterior", "outdoor", "outdoors", "external"],
    "category": "location",
    "description": "Exterior areas with hose bibs, main lines, or irrigation"
  },
  // FIXTURES
  {
    "id": "toilet",
    "aliases": ["toilet", "commode", "wc", "water closet", "john", "loo", "throne"],
    "category": "fixture",
    "description": "Toilet fixture with tank, bowl, and flushing mechanism"
  },
  {
    "id": "faucet",
    "aliases": ["faucet", "tap", "spigot", "water tap", "bathroom faucet", "kitchen faucet", "sink faucet"],
    "category": "fixture",
    "description": "Water tap fixtures for sinks, tubs, and showers"
  },
  {
    "id": "sink",
    "aliases": ["sink", "basin", "kitchen sink", "bathroom sink", "vanity sink", "wash basin"],
    "category": "fixture",
    "description": "Sink basins with drains and supply lines"
  },
  {
    "id": "shower",
    "aliases": ["shower", "shower head", "shower stall", "shower valve", "walk in shower"],
    "category": "fixture",
    "description": "Shower enclosure with valve, head, and drain"
  },
  {
    "id": "bathtub",
    "aliases": ["bathtub", "bath", "tub", "bath tub", "soaking tub", "jacuzzi", "whirlpool"],
    "category": "fixture",
    "description": "Bathtub with drain, overflow, and fixtures"
  },
  {
    "id": "garbage_disposal",
    "aliases": ["garbage disposal", "disposal", "garburator", "food waste disposer", "sink disposal"],
    "category": "fixture",
    "description": "Kitchen sink garbage disposal unit"
  },
  {
    "id": "hose_bib",
    "aliases": ["hose bib", "hosebib", "spigot", "outdoor faucet", "garden faucet", "hose faucet", "silcock"],
    "category": "fixture",
    "description": "Exterior water faucet for hoses and irrigation"
  },
  // APPLIANCES
  {
    "id": "dishwasher",
    "aliases": ["dishwasher", "dish washer", "dish machine", "portable dishwasher"],
    "category": "appliance",
    "description": "Dishwashing appliance with water supply and drain"
  },
  {
    "id": "washing_machine",
    "aliases": ["washing machine", "washer", "clothes washer", "laundry machine"],
    "category": "appliance",
    "description": "Washing machine with hot/cold supply lines and drain"
  },
  {
    "id": "ice_maker",
    "aliases": ["ice maker", "icemaker", "ice machine", "refrigerator ice maker"],
    "category": "appliance",
    "description": "Refrigerator ice maker with water supply line"
  },
  {
    "id": "water_heater",
    "aliases": ["water heater", "hot water heater", "tankless water heater", "boiler", "hot water tank"],
    "category": "appliance",
    "description": "Water heating appliance (tank or tankless)"
  },
  {
    "id": "sump_pump",
    "aliases": ["sump pump", "basement pump", "sump pit pump", "drainage pump"],
    "category": "appliance",
    "description": "Basement sump pump for groundwater removal"
  },
  {
    "id": "water_softener",
    "aliases": ["water softener", "softener", "water conditioner", "ion exchange system"],
    "category": "appliance",
    "description": "Water softening system with brine tank"
  },
  {
    "id": "water_filtration",
    "aliases": ["water filtration", "water filter", "filtration system", "whole house filter", "reverse osmosis"],
    "category": "appliance",
    "description": "Water filtration or purification system"
  },
  // SYSTEMS
  {
    "id": "drain",
    "aliases": ["drain", "drain line", "drain pipe", "sink drain", "shower drain", "floor drain"],
    "category": "system",
    "description": "Drainage piping for waste water removal"
  },
  {
    "id": "sewer",
    "aliases": ["sewer", "sewer line", "main sewer", "sewer pipe", "sanitary sewer"],
    "category": "system",
    "description": "Main sewer line connecting house to municipal system"
  },
  {
    "id": "pipe",
    "aliases": ["pipe", "pipes", "water pipe", "supply pipe", "plumbing pipe", "copper pipe", "pvc pipe", "pex pipe"],
    "category": "system",
    "description": "Water supply or drainage piping throughout building"
  },
  {
    "id": "water_main",
    "aliases": ["water main", "main water line", "water service line", "main supply", "street water line"],
    "category": "system",
    "description": "Main water supply line from street to house"
  },
  {
    "id": "valve",
    "aliases": ["valve", "shutoff valve", "ball valve", "gate valve", "angle stop", "supply valve"],
    "category": "system",
    "description": "Water shutoff valves and control valves"
  },
  {
    "id": "pressure_regulator",
    "aliases": ["pressure regulator", "prv", "pressure reducing valve", "water pressure valve"],
    "category": "system",
    "description": "Water pressure regulating device"
  },
  {
    "id": "water_meter",
    "aliases": ["water meter", "meter", "utility meter", "water usage meter"],
    "category": "system",
    "description": "Municipal water meter measuring usage"
  },
  {
    "id": "backflow_preventer",
    "aliases": ["backflow preventer", "backflow valve", "rpz", "reduced pressure zone", "backflow device"],
    "category": "system",
    "description": "Backflow prevention device protecting water supply"
  },
  {
    "id": "cleanout",
    "aliases": ["cleanout", "clean out", "access point", "sewer cleanout", "drain cleanout"],
    "category": "system",
    "description": "Access point for drain and sewer line cleaning"
  },
  {
    "id": "gas_line",
    "aliases": ["gas line", "gas pipe", "natural gas line", "propane line", "gas supply"],
    "category": "system",
    "description": "Natural gas or propane supply piping"
  }
]
