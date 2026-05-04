// ========================================
// COMPOUND LOCATION DETECTION HELPERS
// ========================================

import { PLUMBING_ISSUE_ITEM_LOOKUP, DAMAGE_PLACE_LOOKUP } from './lookupMaps.js';

// Prepositions for compound location detection (damage_first patterns)
// NOTE: Considered but excluded to prevent false connections:
// - 'on' (e.g., "water on floor" - floor isn't source, just collection point)
// - 'by' (e.g., "leak by sink" - ambiguous proximity, not clear source)
// Current set focuses on clear source-location relationships
const SPATIAL_PREPOSITIONS = [
  'from', 'in', 'at', 'above', 'below', 'under', 'behind', 
  'next to', 'near', 'around', 'through', 'inside', 
  'underneath', 'over', 'across', 'along'
];

// Reverse-direction verbs for source-first patterns
// Pattern: "upstairs bathroom has ceiling leak"
const REVERSE_DIRECTION_VERBS = [
  'has', 'have', 'with', 'shows', 'showing', 'is leaking', 'are leaking',
  'was leaking', 'were leaking', 'dripping from', 'coming from', 'running from'
];

/**
 * Helper: Find area in text using lookup map
 */
export const findAreaInText = (text, lookupMap) => {
  if (!text) return null
  const lowerText = text.toLowerCase().trim()
  return Object.entries(lookupMap).find(([alias]) => 
    lowerText === alias.toLowerCase().trim()
  )
}

/**
 * Helper: Build regex patterns for area relationships
 * Pattern: "ceiling from upstairs bathroom" (damage from source)
 * 
 * @param {Object} lookup - Lookup map (PLUMBING_ISSUE_ITEM_LOOKUP or DAMAGE_PLACE_LOOKUP)
 * @returns {Array} - Array of RegExp patterns
 */
export const buildAreaRelationshipPatterns = (lookup) => {
  const patterns = []
  for (const [alias] of Object.entries(lookup)) {
    // Skip multi-word areas (they're locations, not areas)
    if (alias.includes(' ')) continue
    
    // Pattern: area_name [prepositions] (optional the) location_words
    const prepositionPattern = SPATIAL_PREPOSITIONS.join('|')
    const pattern = new RegExp(`(${alias})\\s+(${prepositionPattern})\\s+(?:the\\s+)?([^.,;!?\\n]+)`, 'gi')
    console.log('pattern', {pattern})
    patterns.push(pattern)
  }
  return patterns
}

/**
 * Helper: Build reverse-direction patterns for source-first relationships
 * Pattern: "upstairs bathroom has ceiling leak" (source has damage)
 * 
 * @param {Object} lookup - Lookup map (PLUMBING_ISSUE_ITEM_LOOKUP or DAMAGE_PLACE_LOOKUP)
 * @returns {Array} - Array of RegExp patterns
 */
export const buildReverseDirectionPatterns = (lookup) => {
  const patterns = []
  const verbPattern = REVERSE_DIRECTION_VERBS.join('|')
  
  for (const [alias] of Object.entries(lookup)) {
    // Skip multi-word areas (they're locations, not areas)
    if (alias.includes(' ')) continue
    
    // Pattern: source_location [verbs] (optional the) damage_area
    const pattern = new RegExp(`([^.,;!?\\n]+)\\s+(${verbPattern})\\s+(?:the\\s+)?(${alias})`, 'gi')
    console.log('reverse pattern', {pattern})
    patterns.push(pattern)
  }
  return patterns
}

/**
 * Helper: Find reverse-direction connections in text using verb patterns
 * Searches text for patterns like "upstairs bathroom has ceiling leak" and returns connections
 * 
 * @param {string} text - Text to search in
 * @param {Array} regexPatterns - Array of RegExp patterns built by buildReverseDirectionPatterns
 * @param {Object} lookupMap - Lookup map (PLUMBING_ISSUE_ITEM_LOOKUP or DAMAGE_PLACE_LOOKUP)
 * @returns {Array} - Array of area connection objects with workLocation and contextLocation
 */
export const findReverseDirectionConnections = (text, regexPatterns, lookupMap) => {
  const foundConnections = []
  const uniqueDamageAreas = new Set()
  
  console.log('DEBUG findReverseDirectionConnections: text:', text)
  
  for (const pattern of regexPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      console.log('DEBUG findReverseDirectionConnections: pattern match:', match)
      // Pattern: (source_candidate) (verb) (damage_candidate)
      // e.g., "upstairs bathroom has ceiling"
      const [, sourceCandidate, verb, damageCandidate] = match
      
      // Track unique damage areas mentioned
      uniqueDamageAreas.add(damageCandidate.toLowerCase())
      
      // For reverse patterns, sourceCandidate should be work location, damageCandidate should be damage area
      const sourceMatch = findAreaInText(sourceCandidate, PLUMBING_ISSUE_ITEM_LOOKUP) || 
                         findAreaInText(sourceCandidate, DAMAGE_PLACE_LOOKUP)
      const damageMatch = findAreaInText(damageCandidate, lookupMap)
      
      console.log('DEBUG findReverseDirectionConnections: sourceMatch:', sourceMatch, 'damageMatch:', damageMatch)
      
      if (sourceMatch && damageMatch) {
        const [sourceAlias, sourceAreaId] = sourceMatch
        const [damageAlias, damageAreaId] = damageMatch
        
        foundConnections.push({
          matchText: `${sourceCandidate} ${verb} ${damageCandidate}`.trim(),
          workLocation: {
            plumbingIssueLocId: sourceAreaId,
            alias: sourceAlias,
            role: 'work_site'
          },
          contextLocation: {
            plumbingIssueLocId: damageAreaId,
            alias: damageAlias,
            role: 'context'
          },
          consumedText: [sourceCandidate.toLowerCase(), damageCandidate.toLowerCase()],
          uniqueDamageAreas: Array.from(uniqueDamageAreas),
          verb,
          confidence: 0.85, // Slightly lower confidence for reverse patterns
          ambiguity: false,
          pattern: 'source-first'
        })
      }
    }
  }
  
  console.log('DEBUG findReverseDirectionConnections: unique damage areas found:', Array.from(uniqueDamageAreas))
  
  return foundConnections
}

/**
 * Helper: Find area connections in text using regex patterns
 * Searches text for patterns like "ceiling from bathroom", "wall behind sink", "floor under toilet" and returns connections
 * 
 * @param {string} text - Text to search in
 * @param {Array} regexPatterns - Array of RegExp patterns built by buildAreaRelationshipPatterns
 * @param {Object} lookupMap - Lookup map (PLUMBING_ISSUE_ITEM_LOOKUP or DAMAGE_PLACE_LOOKUP)
 * @returns {Array} - Array of area connection objects with workLocation and contextLocation
 */
export const findAreaConnectionsInText = (text, regexPatterns, lookupMap) => {
  const foundConnections = []
  const uniqueDamageAreas = new Set() // Track unique damage areas mentioned
  
  console.log('DEBUG findAreaConnectionsInText: text:', text)
  
  for (const pattern of regexPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      console.log('DEBUG findAreaConnectionsInText: pattern match:', match)
      // Pattern: (damage_candidate) (from|in|at) (source_candidate)
      // e.g., "ceiling from upstairs bathroom"
      // Note: "from/in/at" typically means following = source, first = damage
      const [, damageCandidate, preposition, sourceCandidate] = match
      
      // Track unique damage areas mentioned
      uniqueDamageAreas.add(damageCandidate.toLowerCase())
      
      // Validate damage candidate in current lookup map
      const damageMatch = findAreaInText(damageCandidate, lookupMap)
      
      // For source candidate, prioritize work location lookup if damage map
      // because "from/in/at" usually indicates work location (where plumber goes)
      let sourceMatch
      if (lookupMap === DAMAGE_PLACE_LOOKUP) {
        // Try work locations first, then fallback to damage places
        sourceMatch = findAreaInText(sourceCandidate, PLUMBING_ISSUE_ITEM_LOOKUP) || 
                     findAreaInText(sourceCandidate, DAMAGE_PLACE_LOOKUP)
      } else {
        // Already searching work locations
        sourceMatch = findAreaInText(sourceCandidate, lookupMap)
      }
      
      console.log('DEBUG findAreaConnectionsInText: damageMatch:', damageMatch, 'sourceMatch:', sourceMatch)
      
      if (damageMatch && sourceMatch) {
        const [damageAlias, damageAreaId] = damageMatch
        const [sourceAlias, sourceAreaId] = sourceMatch
        
        // Determine work location vs context based on preposition
        // Most prepositions mean sourceCandidate is the work location (where plumber goes)
        // damageCandidate is where damage shows (context for dispatcher)
        const prepositionIndicatesSource = SPATIAL_PREPOSITIONS.includes(preposition.toLowerCase())
        
        foundConnections.push({
          matchText: `${damageCandidate} ${preposition} ${sourceCandidate}`.trim(),
          workLocation: {
            plumbingIssueLocId: prepositionIndicatesSource ? sourceAreaId : damageAreaId,
            alias: prepositionIndicatesSource ? sourceAlias : damageAlias,
            role: 'work_site'
          },
          contextLocation: {
            plumbingIssueLocId: prepositionIndicatesSource ? damageAreaId : sourceAreaId,
            alias: prepositionIndicatesSource ? damageAlias : sourceAlias,
            role: 'context'
          },
          consumedText: [damageCandidate.toLowerCase(), sourceCandidate.toLowerCase()], // Track consumed parts
          uniqueDamageAreas: Array.from(uniqueDamageAreas), // All unique damage areas mentioned
          preposition,
          confidence: 0.87, // High confidence for clear patterns
          ambiguity: false,
          pattern: 'area-first'
        })
      }
    }
  }
  
  console.log('DEBUG findAreaConnectionsInText: unique damage areas found:', Array.from(uniqueDamageAreas))
  
  return foundConnections
}

/**
 * Helper: Deduplicate compounds by compoundAlias
 * 
 * @param {Array} compounds - Array of compound objects
 * @returns {Array} - Deduplicated array
 */
export const deduplicateCompounds = (compounds) => {
  const seen = new Set()
  return compounds.filter(c => {
    const key = c.compoundAlias
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
