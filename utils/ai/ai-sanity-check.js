/**
 * 🧪 AI Sanity Check - Quick CLI Test Script
 * 
 * Run with: node utils/ai/ai-sanity-check.js
 * 
 * Tests the AI detection system with various customer inputs
 * to ensure it's working correctly.
 */

import { suggestJobType } from './aiBasicLearner.js'

const testCases = [
  {
    name: 'Gas Leak (IMMEDIATE)',
    input: 'I smell gas in my living room',
    expectedCategory: 'gas_line_services'
  },
  {
    name: 'Burst Pipe (IMMEDIATE)',
    input: 'The pipe burst in my basement and water is everywhere',
    expectedCategory: 'emergency_plumbing'
  },
  {
    name: 'Burst Pipe - Alternative Phrasing',
    input: 'The pipe has burst and water is shooting out',
    expectedCategory: 'emergency_plumbing'
  },
  {
    name: 'Water Heater (SAME_DAY)',
    input: 'My water heater is not working and there is no hot water',
    expectedCategory: 'water_heater_services'
  },
  {
    name: 'Sewer Backup (SAME_DAY)',
    input: 'Sewage is backing up into my shower',
    expectedCategory: 'drain_cleaning_sewer'
  },
  {
    name: 'Leaky Faucet (SCHEDULE)',
    input: 'My kitchen faucet is dripping',
    expectedCategory: 'bathroom_kitchen_fixtures'
  },
  {
    name: 'Running Toilet (SCHEDULE)',
    input: 'My toilet keeps running and wont stop',
    expectedCategory: 'bathroom_kitchen_fixtures'
  },
  {
    name: 'Multi-Issue (Complex)',
    input: 'I smell gas in my living room and have a leaky faucet. Oh, and the pipe has burst in the basement!',
    expectedCategory: 'gas_line_services'
  },
  {
    name: 'Low Water Pressure (SCHEDULE)',
    input: 'I have low water pressure in my house',
    expectedCategory: 'maintenance_inspection'
  },
  {
    name: 'Clogged Drain (SAME_DAY)',
    input: 'My sink is clogged and water is backing up',
    expectedCategory: 'drain_cleaning_sewer'
  }
]

console.log('\n' + '='.repeat(80))
console.log('🧪 FlowPro AI Sanity Check')
console.log('='.repeat(80) + '\n')

let passed = 0
let failed = 0

testCases.forEach((testCase, idx) => {
  const result = suggestJobType(testCase.input)
  const isCorrect = result.category === testCase.expectedCategory
  const status = isCorrect ? '✅ PASS' : '❌ FAIL'

  console.log(`Test ${idx + 1}: ${testCase.name}`)
  console.log(`  Input: "${testCase.input}"`)
  console.log(`  Expected: ${testCase.expectedCategory}`)
  console.log(`  Got: ${result.category}`)
  console.log(`  Confidence: ${Math.round(result.confidence * 100)}%`)
  console.log(`  ${status}\n`)

  if (isCorrect) {
    passed++
  } else {
    failed++
  }
})

console.log('='.repeat(80))
console.log(`Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`)
console.log('='.repeat(80) + '\n')

if (failed === 0) {
  console.log('🎉 All tests passed! AI is working correctly.\n')
} else {
  console.log(`⚠️  ${failed} test(s) failed. Review the AI patterns.\n`)
}
