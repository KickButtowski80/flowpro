#!/usr/bin/env node

// Isolated compound location detection test
import { buildAreaRelationshipPatterns, findAreaConnectionsInText } from './utils/ai/compoundLocationHelpers.js'
import { DAMAGE_PLACE_LOOKUP, PLUMBING_ISSUE_ITEM_LOOKUP } from './utils/ai/lookupMaps.js'

console.log('=== COMPOUND LOCATION DETECTION DEBUG ===\n')

// Test input
const testText = "Water is pouring through the ceiling from the upstairs bathroom, the ceiling is bubbling and sagging."
console.log('Test input:', testText)
console.log('')

// Build patterns
console.log('Building patterns...')
const workPatterns = buildAreaRelationshipPatterns(PLUMBING_ISSUE_ITEM_LOOKUP)
const damagePatterns = buildAreaRelationshipPatterns(DAMAGE_PLACE_LOOKUP)

console.log('Work patterns count:', workPatterns.length)
console.log('Damage patterns count:', damagePatterns.length)
console.log('')

// Test damage place patterns (should find the relationship)
console.log('=== TESTING DAMAGE PLACE PATTERNS ===')
console.log('Looking for patterns like "ceiling from upstairs bathroom"')
const damageConnections = findAreaConnectionsInText(testText, damagePatterns, DAMAGE_PLACE_LOOKUP)
console.log('Damage connections found:', damageConnections.length)
console.log('')

// Test work location patterns (should not find anything)
console.log('=== TESTING WORK LOCATION PATTERNS ===')
console.log('Looking for work location patterns')
const workConnections = findAreaConnectionsInText(testText, workPatterns, PLUMBING_ISSUE_ITEM_LOOKUP)
console.log('Work connections found:', workConnections.length)
console.log('')

// Show sample patterns
console.log('=== SAMPLE PATTERNS ===')
console.log('First 5 damage patterns:')
damagePatterns.slice(0, 5).forEach((pattern, i) => {
  console.log(`${i + 1}:`, pattern)
})
console.log('')

// Check lookup maps
console.log('=== LOOKUP MAP VERIFICATION ===')
console.log('Checking if "ceiling" exists in DAMAGE_PLACE_LOOKUP:', 'ceiling' in DAMAGE_PLACE_LOOKUP)
console.log('Checking if "bathroom" exists in DAMAGE_PLACE_LOOKUP:', 'bathroom' in DAMAGE_PLACE_LOOKUP)
console.log('Checking if "upstairs bathroom" exists in DAMAGE_PLACE_LOOKUP:', 'upstairs bathroom' in DAMAGE_PLACE_LOOKUP)
console.log('')

console.log('Checking if "ceiling" exists in PLUMBING_ISSUE_ITEM_LOOKUP:', 'ceiling' in PLUMBING_ISSUE_ITEM_LOOKUP)
console.log('Checking if "bathroom" exists in PLUMBING_ISSUE_ITEM_LOOKUP:', 'bathroom' in PLUMBING_ISSUE_ITEM_LOOKUP)
console.log('')

// Test the specific pattern match
console.log('=== PATTERN MATCH TEST ===')
const testPattern = /(ceiling)\s+(from|in|at)\s+(?:the\s+)?([^.,;!?\\n]+)/gi
let match
while ((match = testPattern.exec(testText)) !== null) {
  console.log('Pattern match:', match)
  const [, damageCandidate, preposition, sourceCandidate] = match
  console.log('Damage candidate:', damageCandidate)
  console.log('Preposition:', preposition)
  console.log('Source candidate:', sourceCandidate)
  
  // Test lookups
  const damageMatch = DAMAGE_PLACE_LOOKUP[damageCandidate.toLowerCase()]
  const sourceMatch = DAMAGE_PLACE_LOOKUP[sourceCandidate.toLowerCase()]
  
  console.log('Damage lookup result:', damageMatch)
  console.log('Source lookup result:', sourceMatch)
}
