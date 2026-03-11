// 🎯 Priority Bucket 1: Specific Phrases (Highest Confidence: 0.9)
// These are exact phrases that customers commonly use
export const SPECIFIC_PHRASES = {
  // Emergency plumbing (from Balkan Plumbing research)
  'smell gas': 'gas_line_services',
  'gas leak': 'gas_line_services',
  'dizziness': 'gas_line_services',
  'nausea': 'gas_line_services',
  'sewer gas': 'gas_line_services',
  'frozen pipes': 'emergency_plumbing',
  'frozen pipe': 'emergency_plumbing',
  'burst pipe': 'emergency_plumbing',
  'burst pipes': 'emergency_plumbing',
  'no water': 'emergency_plumbing',
  'water everywhere': 'emergency_plumbing',
  'flooding': 'emergency_plumbing',
  'water damage': 'emergency_plumbing',
  'main water': 'emergency_plumbing',
  'water main': 'emergency_plumbing',
  'emergency': 'emergency_plumbing',
  'urgent': 'emergency_plumbing',
  'immediately': 'emergency_plumbing',

  // Water heater issues (from Nationwide research)
  'water heater': 'water_heater_services',
  'no hot water': 'water_heater_services',
  'lukewarm water': 'water_heater_services',
  'cold shower': 'water_heater_services',
  'tankless': 'water_heater_services',
  'pilot light': 'water_heater_services',
  'strange noises': 'water_heater_services',
  'sediment': 'water_heater_services',
  'heater not working': 'water_heater_services',
  'extinguished pilot': 'water_heater_services',

  // Drain cleaning (from real customer calls)
  'toilet clogged': 'drain_cleaning_sewer',
  'sink clogged': 'drain_cleaning_sewer',
  'bathtub clogged': 'drain_cleaning_sewer',
  'sewer backup': 'drain_cleaning_sewer',
  'hydro jetting': 'drain_cleaning_sewer',

  // Toilet issues (from Nationwide research)
  'toilet keeps running': 'bathroom_kitchen_fixtures',
  'wont stop running': 'bathroom_kitchen_fixtures',
  'wont flush': 'bathroom_kitchen_fixtures',
  'toilet overflowing': 'bathroom_kitchen_fixtures',
  'flapper': 'bathroom_kitchen_fixtures',
  'fill valve': 'bathroom_kitchen_fixtures',
  'flush valve': 'bathroom_kitchen_fixtures',
  'overflow tube': 'bathroom_kitchen_fixtures',

  // Faucet and fixture issues (from real customer language)
  'leaky faucet': 'bathroom_kitchen_fixtures',
  'dripping faucet': 'bathroom_kitchen_fixtures',
  'garbage disposal': 'bathroom_kitchen_fixtures',

  // Pipe leaks (from professional sources)
  'pipe leak': 'plumbing_repairs',
  'leaking pipe': 'plumbing_repairs',
  'dripping pipe': 'plumbing_repairs',
  'main shut-off': 'plumbing_repairs',
  'water valve': 'plumbing_repairs',

  // Low water pressure (from Nationwide research)
  'low water pressure': 'maintenance_inspection',
  'weak water flow': 'maintenance_inspection',
  'no water flow': 'maintenance_inspection',
  'mineral buildup': 'maintenance_inspection',

  // Outdoor and drainage
  'sump pump': 'outdoor_drainage',
  'french drain': 'outdoor_drainage'
}
