// ========================================
// COMPOUND LOCATION DETECTION HELPERS
// ========================================

/**
 * Helper: Find area match in text
 * Searches for any known area alias in the given text
 * 
 * @param {string} text - Text to search in
 * @param {Object} areaLookup - AREA_LOOKUP object
 * @returns {Array|null} - [alias, areaId] or null
 */
export const findAreaInText = (text, areaLookup) => {
  if (!text) return null
  const lowerText = text.toLowerCase()
  return Object.entries(areaLookup).find(([alias]) => 
    lowerText.includes(alias.toLowerCase())
  )
}

/**
 * Helper: Build regex patterns for area-first compounds
 * Pattern: "ceiling from upstairs bathroom"
 * 
 * @param {Object} areaLookup - AREA_LOOKUP object
 * @returns {Array} - Array of RegExp patterns
 */
export const buildAreaFirstPatterns = (areaLookup) => {
  const patterns = []
  for (const [alias] of Object.entries(areaLookup)) {
    // Skip multi-word areas (they're locations, not areas)
    if (alias.includes(' ')) continue
    
    // Pattern: area_name from/in/at (optional the) location_words
    const pattern = new RegExp(`(${alias})\\s+(from|in|at)\\s+(?:the\\s+)?([^.,;!?\\n]+)`, 'gi')
    console.log('pattern', {pattern})
    patterns.push(pattern)
  }
  return patterns
}

/**
 * Helper: Process area-first pattern matches
 * Validates and creates area relationship objects
 * NOTE: Both source and damage are looked up in AREA_LOOKUP - the distinction is semantic
 * 
 * @param {string} clause - Text clause to search in
 * @param {Array} patterns - Array of RegExp patterns
 * @param {Object} areaLookup - AREA_LOOKUP object
 * @returns {Array} - Array of area relationship objects
 */
export const processAreaFirstMatches = (clause, patterns, areaLookup) => {
  const relationships = []
  
  console.log('DEBUG processAreaFirstMatches: clause:', clause)
  
  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(clause)) !== null) {
      console.log('DEBUG processAreaFirstMatches: pattern match:', match)
      // Pattern: (damage_candidate) (from|in|at) (source_candidate)
      // e.g., "ceiling from upstairs bathroom"
      // Note: "from/in/at" typically means following = source, first = damage
      const [, damageCandidate, preposition, sourceCandidate] = match
      
      // Validate both parts are known areas
      const damageMatch = findAreaInText(damageCandidate, areaLookup)
      const sourceMatch = findAreaInText(sourceCandidate, areaLookup)
      
      console.log('DEBUG processAreaFirstMatches: damageMatch:', damageMatch, 'sourceMatch:', sourceMatch)
      
      if (damageMatch && sourceMatch) {
        const [damageAlias, damageAreaId] = damageMatch
        const [sourceAlias, sourceAreaId] = sourceMatch
        
        // Determine work location vs context based on preposition
        // "from/in/at" means sourceCandidate is the work location (where plumber goes)
        // damageCandidate is where damage shows (context for dispatcher)
        const isSourceSecond = ['from', 'in', 'at'].includes(preposition.toLowerCase())
        
        relationships.push({
          matchText: `${damageCandidate} ${preposition} ${sourceCandidate}`.trim(),
          workLocation: {
            alias: isSourceSecond ? sourceAlias : damageAlias,
            areaId: isSourceSecond ? sourceAreaId : damageAreaId,
            role: 'work_site'
          },
          contextLocation: {
            alias: isSourceSecond ? damageAlias : sourceAlias,
            areaId: isSourceSecond ? damageAreaId : sourceAreaId,
            role: 'context'
          },
          preposition,
          confidence: 0.87, // High confidence for clear patterns
          ambiguity: false,
          pattern: 'area-first'
        })
      }
    }
  }
  
  console.log('DEBUG processAreaFirstMatches: final relationships:', relationships)
  return relationships
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
