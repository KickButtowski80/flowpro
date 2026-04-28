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
  }
]
