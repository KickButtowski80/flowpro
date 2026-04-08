// 🎯 Priority Bucket 2: Regex Patterns (Medium Confidence: 0.7)
// These patterns handle word order variations, plurals, and flexible matching
export const REGEX_PATTERNS = [
  // Emergency patterns
  { pattern: /gas.*smell|smell.*gas/i, category: 'gas_line_services' },
  { pattern: /frozen.*pipe|pipe.*frozen/i, category: 'emergency_plumbing' },
  { pattern: /burst.*pipe|pipe.*burst/i, category: 'emergency_plumbing' },
  { pattern: /water.*everywhere|everywhere.*water/i, category: 'emergency_plumbing' },
  { pattern: /flood|flooding|water.*damage/i, category: 'emergency_plumbing' },
  { pattern: /no.*water|water.*no/i, category: 'emergency_plumbing' },
  { pattern: /emergency|urgent|immediate/i, category: 'emergency_plumbing' },

  // Water heater patterns
  { pattern: /water.*heat|heat.*water/i, category: 'water_heater_services' },
  { pattern: /hot.*water|water.*hot/i, category: 'water_heater_services' },
  { pattern: /lukewarm.*water|water.*lukewarm/i, category: 'water_heater_services' },
  { pattern: /cold.*shower|shower.*cold/i, category: 'water_heater_services' },
  { pattern: /tankless|pilot.*light/i, category: 'water_heater_services' },
  { pattern: /strange.*noise|noise.*strange/i, category: 'water_heater_services' },
  { pattern: /heater.*not.*work|work.*heater/i, category: 'water_heater_services' },

  // Drain patterns
  { pattern: /clog|clogged|clogging/i, category: 'drain_cleaning_sewer' },
  { pattern: /drain.*back|back.*drain/i, category: 'drain_cleaning_sewer' },
  { pattern: /slow.*drain|drain.*slow/i, category: 'drain_cleaning_sewer' },
  { pattern: /water.*pool|pool.*water/i, category: 'drain_cleaning_sewer' },
  { pattern: /hair.*buildup|soap.*buildup/i, category: 'drain_cleaning_sewer' },
  { pattern: /tree.*root|root.*tree/i, category: 'drain_cleaning_sewer' },
  { pattern: /foul.*odor|odor.*foul/i, category: 'drain_cleaning_sewer' },
  { pattern: /unsanitary|sewer/i, category: 'drain_cleaning_sewer' },

  // Toilet patterns
  { pattern: /toilet.*run|run.*toilet/i, category: 'bathroom_kitchen_fixtures' },
  { pattern: /running.*toilet|toilet.*running/i, category: 'bathroom_kitchen_fixtures' },
  { pattern: /toilet.*flush|flush.*toilet/i, category: 'bathroom_kitchen_fixtures' },
  { pattern: /toilet.*overflow|overflow.*toilet/i, category: 'bathroom_kitchen_fixtures' },

  // Faucet patterns
  { pattern: /leaky.*faucet|faucet.*leaky/i, category: 'bathroom_kitchen_fixtures' },
  { pattern: /dripping.*faucet|faucet.*dripping/i, category: 'bathroom_kitchen_fixtures' },

  // Pipe patterns
  { pattern: /leak.*pipe|pipe.*leak/i, category: 'plumbing_repairs' },
  { pattern: /dripping.*pipe|pipe.*dripping/i, category: 'plumbing_repairs' },

  // Pressure patterns
  { pattern: /low.*pressure|pressure.*low/i, category: 'maintenance_inspection' },
  { pattern: /weak.*flow|flow.*weak/i, category: 'maintenance_inspection' },

  // Maintenance patterns
  { pattern: /maintenance|inspection|check.*up/i, category: 'maintenance_inspection' },
  { pattern: /routine|annual|preventive/i, category: 'maintenance_inspection' },

  // Outdoor patterns
  { pattern: /sump.*pump|pump.*sump/i, category: 'outdoor_drainage' },
  { pattern: /french.*drain|drain.*french/i, category: 'outdoor_drainage' },
  { pattern: /outdoor.*faucet|faucet.*outdoor/i, category: 'outdoor_drainage' }
]
