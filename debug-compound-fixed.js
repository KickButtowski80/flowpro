#!/usr/bin/env node

// Test compound detection with corrected lookup priority
import { buildAreaRelationshipPatterns, findAreaConnectionsInText } from './utils/ai/compoundLocationHelpers.js'
import { DAMAGE_PLACE_LOOKUP, PLUMBING_ISSUE_ITEM_LOOKUP } from './utils/ai/lookupMaps.js'

console.log('=== FIXED COMPOUND DETECTION TEST ===\n')

const testText = "water is pouring through the ceiling from the upstairs bathroom"
console.log('Test input:', testText)
console.log('')

// Test the specific pattern with work location lookup
console.log('=== TESTING WORK LOCATION LOOKUP FOR SOURCE ===')
const testPattern = /(ceiling)\s+(from|in|at)\s+(?:the\s+)?([^.,;!?\\n]+)/gi
let match
while ((match = testPattern.exec(testText)) !== null) {
  console.log('Pattern match:', match)
  const [, damageCandidate, preposition, sourceCandidate] = match
  console.log('Damage candidate:', damageCandidate)
  console.log('Preposition:', preposition)
  console.log('Source candidate:', sourceCandidate)
  
  // Test damage lookup (for damage location)
  const damageMatch = DAMAGE_PLACE_LOOKUP[damageCandidate.toLowerCase()]
  console.log('Damage lookup result:', damageMatch)
  
  // Test work location lookup FIRST (for work location)
  const workMatch = PLUMBING_ISSUE_ITEM_LOOKUP[sourceCandidate.toLowerCase()]
  console.log('Work location lookup result:', workMatch)
  
  // Fallback to damage lookup if not found in work locations
  const sourceMatch = workMatch || DAMAGE_PLACE_LOOKUP[sourceCandidate.toLowerCase()]
  console.log('Final source lookup result:', sourceMatch)
  
  if (damageMatch && workMatch) {
    console.log('✅ PERFECT: Found damage location AND work location')
    console.log('   Damage:', damageMatch, '(where damage shows)')
    console.log('   Work:', workMatch, '(where plumber works)')
  }
}
