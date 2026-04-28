/**
 * Damage Places - Locations where plumbing damage/manifestation is VISIBLE
 * These are the "context locations" - where the customer sees the problem
 * e.g., "ceiling from upstairs bathroom" → ceiling is where damage shows
 */

export default [
  {
    "id": "ceiling",
    "aliases": ["ceiling", "bathroom ceiling", "kitchen ceiling", "ceiling drywall", "ceiling paint", "upstairs ceiling", "downstairs ceiling"],
    "category": "surface",
    "description": "Ceiling surfaces affected by plumbing leaks from above"
  },
  {
    "id": "wall",
    "aliases": ["wall", "bathroom wall", "kitchen wall", "interior wall", "drywall", "wall paint", "inside wall"],
    "category": "surface",
    "description": "Wall surfaces affected by plumbing leaks inside"
  },
  {
    "id": "floor",
    "aliases": ["floor", "flooring", "bathroom floor", "kitchen floor", "basement floor", "garage floor", "subfloor"],
    "category": "surface",
    "description": "Floor surfaces where water pools or leaks through"
  },
  {
    "id": "foundation",
    "aliases": ["foundation", "concrete foundation", "slab", "foundation wall", "crawl space"],
    "category": "structure",
    "description": "Foundation areas where water intrusion occurs"
  },
  {
    "id": "yard",
    "aliases": ["yard", "lawn", "front yard", "back yard", "garden", "landscape"],
    "category": "exterior",
    "description": "Exterior yard areas with water line breaks or sewer issues"
  },
  {
    "id": "driveway",
    "aliases": ["driveway", "drive way", "concrete driveway", "asphalt driveway"],
    "category": "exterior",
    "description": "Driveway surfaces where water main breaks or leaks appear"
  },
  {
    "id": "baseboard",
    "aliases": ["baseboard", "baseboards", "molding", "floor trim", "wall bottom", "baseboard molding"],
    "category": "surface",
    "description": "Floor trim and baseboards where water wicks up from slab or floor leaks"
  },
  {
    "id": "under_sink_cabinet",
    "aliases": ["cabinet", "under sink", "sink cabinet", "vanity", "under kitchen sink", "under bathroom sink", "cabinet under sink"],
    "category": "surface",
    "description": "Cabinet areas beneath sinks where drain or faucet leaks pool"
  },
  {
    "id": "stairwell",
    "aliases": ["stairs", "stairwell", "staircase", "steps", "stair landing", "stairway"],
    "category": "surface",
    "description": "Stair areas where water tracks down from upper floor leaks"
  }
]
