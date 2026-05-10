/**
 * Mock data for lookupMaps tests
 * Provides predictable test data without loading from files
 */

export const mockPlumbingIssueItems = {
  'toilet': { category: 'fixture', type: 'plumbing' },
  'sink': { category: 'fixture', type: 'plumbing' },
  'faucet': { category: 'fixture', type: 'plumbing' },
  'shower': { category: 'fixture', type: 'plumbing' },
  'bathtub': { category: 'fixture', type: 'plumbing' },
  'bathroom': { category: 'room', type: 'area' },
  'kitchen': { category: 'room', type: 'area' },
  'ceiling': { category: 'structure', type: 'area' },
  'wall': { category: 'structure', type: 'area' },
  'floor': { category: 'structure', type: 'area' },
  'pipe': { category: 'component', type: 'plumbing' },
  'water heater': { category: 'appliance', type: 'plumbing' },
  'drain': { category: 'component', type: 'plumbing' }
}

export const mockDamagePlaceLookup = {
  'ceiling': { category: 'damage_place', severity: 'medium' },
  'wall': { category: 'damage_place', severity: 'medium' },
  'floor': { category: 'damage_place', severity: 'medium' },
  'foundation': { category: 'damage_place', severity: 'high' }
}

export const mockSymptoms = {
  'leaking': { category: 'symptom', urgency: 'medium' },
  'dripping': { category: 'symptom', urgency: 'low' },
  'clogged': { category: 'symptom', urgency: 'medium' },
  'bursting': { category: 'symptom', urgency: 'high' },
  'flooding': { category: 'symptom', urgency: 'high' },
  'no water': { category: 'symptom', urgency: 'high' }
}

export const mockSymptomGroups = [
  {
    name: 'water_issues',
    symptoms: ['leaking', 'dripping', 'bursting', 'flooding'],
    category: 'water_leak',
    urgency: 'high'
  },
  {
    name: 'drainage_issues',
    symptoms: ['clogged', 'backed up', 'slow drain'],
    category: 'drainage',
    urgency: 'medium'
  }
]
