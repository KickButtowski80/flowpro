/**
 * Test utilities for lookupMaps tests
 * Creates test versions of functions using mock data
 */

import { mockPlumbingIssueItems, mockSymptoms } from './mockData.js'

/**
 * Create test version of findAreaMatches using mock data
 */
export function createTestFindAreaMatches(mockData) {
  // Build lookup map from mock data
  const lookupMap = {}
  Object.keys(mockData).forEach(key => {
    lookupMap[key] = { id: key, ...mockData[key] }
  })
  
  // Create regex pattern from mock data keys
  const pattern = new RegExp(Object.keys(mockData).join('|'), 'gi')
  
  return function findAreaMatches(text) {
    const matches = []
    const seen = new Set()
    
    let match
    while ((match = pattern.exec(text)) !== null) {
      const word = match[0].toLowerCase()
      if (lookupMap[word] && !seen.has(word)) {
        seen.add(word)
        matches.push({
          id: word,
          text: word,
          start: match.index,
          end: match.index + word.length,
          ...lookupMap[word]
        })
      }
    }
    
    return matches
  }
}

/**
 * Create test version of findSymptomMatches using mock data
 */
export function createTestFindSymptomMatches(mockData) {
  // Build lookup map from mock data
  const lookupMap = {}
  Object.keys(mockData).forEach(key => {
    lookupMap[key] = { id: key, ...mockData[key] }
  })
  
  // Create regex pattern from mock data keys
  const pattern = new RegExp(Object.keys(mockData).join('|'), 'gi')
  
  return function findSymptomMatches(text) {
    const matches = []
    const seen = new Set()
    
    let match
    while ((match = pattern.exec(text)) !== null) {
      const word = match[0].toLowerCase()
      if (lookupMap[word] && !seen.has(word)) {
        seen.add(word)
        matches.push({
          id: word,
          text: word,
          start: match.index,
          end: match.index + word.length,
          ...lookupMap[word]
        })
      }
    }
    
    return matches
  }
}

/**
 * Create test version of debugMatches using mock data
 */
export function createTestDebugMatches(mockAreaData, mockSymptomData) {
  const findAreaMatches = createTestFindAreaMatches(mockAreaData)
  const findSymptomMatches = createTestFindSymptomMatches(mockSymptomData)
  
  return function debugMatches(text) {
    return {
      areas: findAreaMatches(text),
      symptoms: findSymptomMatches(text)
    }
  }
}
