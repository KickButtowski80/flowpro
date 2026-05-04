// ========================================
// AI PATTERN MATCHING SYSTEM
// ========================================

// Split location data: damage places (context) vs plumbing issue locations (work)
import DAMAGE_PLACES from '../../data/damagePlaces.js'
import { PLUMBING_ISSUE_ITEMS } from '../../data/plumbingIssueItems.js'
import SYMPTOMS from '../../data/symptoms.js'
import AREA_JOB_CONFIGS from '../../data/areaJobConfigs.js'
import { findAreaInText, buildAreaRelationshipPatterns, findAreaConnectionsInText, deduplicateCompounds } from './compoundLocationHelpers.js'

// ========================================
// NORMALIZATION & LOOKUP MAPS
// ========================================

/**
 * Normalizes text for consistent matching
 * - Lowercase conversion
 * - Remove extra whitespace
 * - Standardize punctuation
 */
export const normalizeText = (text) => {
  return text.toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.,;:!?]/g, ' ')
}

// Create lookup maps for efficient pattern matching
export const DAMAGE_PLACE_LOOKUP = {}
export const PLUMBING_ISSUE_ITEM_LOOKUP = {}
export const SYMPTOM_LOOKUP = {}

// Metadata maps to store category and other properties
export const PLUMBING_LOCATION_METADATA = {}
export const DAMAGE_PLACE_METADATA = {}

// Build damage place lookup map (where damage is visible - contextLocation)
DAMAGE_PLACES.forEach(place => {
  place.aliases.forEach(alias => {
    DAMAGE_PLACE_LOOKUP[alias.toLowerCase()] = place.id
  })
  DAMAGE_PLACE_METADATA[place.id] = {
    category: place.category || 'location',
    description: place.description
  }
})

// Build plumbing work items lookup map (where plumber works - workLocation)
PLUMBING_ISSUE_ITEMS.forEach(item => {
  item.customerSearchTerms.forEach(alias => {
    PLUMBING_ISSUE_ITEM_LOOKUP[alias.toLowerCase()] = item.locationId
  })
  PLUMBING_LOCATION_METADATA[item.locationId] = {
    dispatchCategory: item.dispatchCategory,
    technicalDescription: item.technicalDescription
  }
})

// NOTE: Separate lookups maintained for semantic clarity
// DAMAGE_PLACE_LOOKUP = where damage is visible (context location)
// PLUMBING_ISSUE_ITEM_LOOKUP = where plumber works (work location)
// These are NOT combined to enforce strict semantic separation

// Build symptom lookup map from aliases
SYMPTOMS.forEach(symptom => {
  symptom.aliases.forEach(alias => {
    SYMPTOM_LOOKUP[alias.toLowerCase()] = symptom.id
  })
})

// ========================================
// REGEX PATTERNS
// ========================================

// Build separate regex patterns for semantic clarity
const DAMAGE_PLACE_WORDS = Object.keys(DAMAGE_PLACE_LOOKUP).join('|')
const PLUMBING_LOCATION_WORDS = Object.keys(PLUMBING_ISSUE_ITEM_LOOKUP).join('|')
const SYMPTOM_WORDS = Object.keys(SYMPTOM_LOOKUP).join('|')

// Separate regexes for each location type
export const DAMAGE_PLACE_REGEX = new RegExp(`\b(${DAMAGE_PLACE_WORDS})\b`, 'gi')
export const PLUMBING_LOCATION_REGEX = new RegExp(`\\b(${PLUMBING_LOCATION_WORDS})\\b`, 'gi')
export const SYMPTOM_REGEX = new RegExp(`\b(${SYMPTOM_WORDS})\b`, 'gi')

// ========================================
// SYMPTOM GROUPING
// ========================================

/**
 * Detect symptom groups connected by "and"
 * Example: "bubbling and sagging" → ["bubbling", "sagging"]
 * Example: "leaking, dripping, and running" → ["leaking", "dripping", "running"]
 * 
 * @param {string} text - Text to search for symptom groups
 * @returns {Array} - Array of symptom groups, each containing multiple symptoms
 */
export const detectSymptomGroups = (text) => {
  const symptomGroups = []
  
  // Pattern: symptom (and|,) symptom (and|,) symptom
  // Matches: "bubbling and sagging", "leaking, dripping, and running"
  const symptomGroupPattern = new RegExp(
    `(${SYMPTOM_WORDS})\\s*(?:and|,)\\s*(${SYMPTOM_WORDS})(?:\\s*(?:and|,)\\s*(${SYMPTOM_WORDS}))*`,
    'gi'
  )
  
  let match
  while ((match = symptomGroupPattern.exec(text)) !== null) {
    const group = match.slice(1).filter(Boolean) // Remove undefined/null values
    if (group.length > 1) {
      symptomGroups.push(group)
    }
  }
  
  return symptomGroups
}

// ========================================
// MATCHING RULES
// ========================================

const createMatchingRules = () => {
  const allRules = []

  // Loop through each area job config and create a flat rule per area+symptom pair
  AREA_JOB_CONFIGS.forEach(areaJobConfig => {
    // For each area job config, create rules for all its supported symptoms
    areaJobConfig.supportedSymptoms.forEach(symptomId => {
      const rule = {
        plumbingIssueLocId: areaJobConfig.area,       // e.g., "toilet" 
        symptomId: symptomId,             // e.g., "clog", "running"
        pattern: areaJobConfig            // Full area job config with jobType, overrides, etc.
      }
      allRules.push(rule)
    })
  })

  return allRules
}

export const MATCHING_RULES = createMatchingRules()
export const RULES_BY_AREA = (() => {
  const byArea = new Map()
  for (const { plumbingIssueLocId, symptomId } of MATCHING_RULES) {
    if (!byArea.has(plumbingIssueLocId)) byArea.set(plumbingIssueLocId, new Set())
    byArea.get(plumbingIssueLocId).add(symptomId)
  }
  return byArea
})()

// ========================================
// CATEGORY HELPER FUNCTIONS
// ========================================

/**
 * Get work item category for dispatch decisions
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {string|null} - Category (fixture, component, appliance, system) or null
 */
export const getWorkItemCategory = (plumbingIssueLocId) => {
  return PLUMBING_LOCATION_METADATA[plumbingIssueLocId]?.dispatchCategory || null
}

/**
 * Get category for a damage place ID
 * @param {string} placeId - The damage place ID
 * @returns {string|null} - Category or null
 */
export const getDamagePlaceCategory = (placeId) => {
  return DAMAGE_PLACE_METADATA[placeId]?.dispatchCategory || null
}

/**
 * Check if a plumbing issue location is a component (specific part)
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {boolean}
 */
export const isComponent = (plumbingIssueLocId) => {
  return getWorkItemCategory(plumbingIssueLocId) === 'component'
}

/**
 * Check if a plumbing issue location is a fixture (complete unit)
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {boolean}
 */
export const isFixture = (plumbingIssueLocId) => {
  return getWorkItemCategory(plumbingIssueLocId) === 'fixture'
}

/**
 * Check if a plumbing issue location is an appliance (major equipment)
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {boolean}
 */
export const isAppliance = (plumbingIssueLocId) => {
  return getWorkItemCategory(plumbingIssueLocId) === 'appliance'
}

/**
 * Check if a plumbing issue location is a system (infrastructure)
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {boolean}
 */
export const isSystem = (plumbingIssueLocId) => {
  return getWorkItemCategory(plumbingIssueLocId) === 'system'
}

/**
 * Get team size recommendation based on category
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {number} - Recommended team size (1, 2, or 3)
 */
export const getTeamSizeRecommendation = (plumbingIssueLocId) => {
  const category = getWorkItemCategory(plumbingIssueLocId)
  switch (category) {
    case 'component':
      return 1 // Simple part replacement
    case 'fixture':
      return 1 // Most fixture repairs are single plumber
    case 'appliance':
      return 2 // Water heaters, sump pumps often need 2 for safety/lifting
    case 'system':
      return 2 // Sewer lines, main pipes may need 2+
    default:
      return 1
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Detects relationships between two areas: where work is done vs where problem shows
 * Uses separate lookups for semantic clarity:
 * - PLUMBING_WORK_LOCATION_LOOKUP for work locations (where plumber fixes)
 * - DAMAGE_PLACE_LOOKUP for context locations (where damage is visible)
 * 
 * Example: "ceiling from upstairs bathroom"
 * - workLocation: upstairs bathroom (where plumber goes to fix) - PLUMBING_WORK_LOCATION
 * - contextLocation: ceiling (where damage is visible) - DAMAGE_PLACE
 * 
 * @param {string} clause - Text clause to search in
 * @returns {Array} - Array of area relationship objects
 */
const detectAreaRelationships = (clause) => {
  // debugger;
  
  // Normalize input
  const text = String(clause || '').replace(/\s+/g, ' ').trim()
  if (!text) return []
  
  console.log('DEBUG: Detecting area relationships in clause:', text)
  
  // Build regex patterns for detecting area relationships
  const workAreaRegexPatterns = buildAreaRelationshipPatterns(PLUMBING_ISSUE_ITEM_LOOKUP)
  const damageAreaRegexPatterns = buildAreaRelationshipPatterns(DAMAGE_PLACE_LOOKUP)
  
  // Search text for area connections using the regex patterns
  const foundWorkAreaConnections = findAreaConnectionsInText(text, workAreaRegexPatterns, PLUMBING_ISSUE_ITEM_LOOKUP)
  const foundDamageAreaConnections = findAreaConnectionsInText(text, damageAreaRegexPatterns, DAMAGE_PLACE_LOOKUP)
  const allDetectedConnections = foundWorkAreaConnections.concat(foundDamageAreaConnections)
  
  // Remove duplicate connections
  const uniqueConnections = deduplicateCompounds(allDetectedConnections)
  
  console.log('DEBUG: Final detected connections:', JSON.stringify(uniqueConnections, null, 2))
  return uniqueConnections
}

/**
 * Helper function: collect longest area aliases in a clause
 * Keeps the longest alias for each area (more specific = better context)
 * Prevents overlapping shorter aliases by processing longest first
 * Checks for area relationships first (e.g., "ceiling from upstairs bathroom")
 * 
 * @param {string} clause - Text clause to search in
 * @returns {Array} - Array of objects with plumbingIssueLocId and alias
 */
const collectAreaAliases = (clause) => {
  const aliasMap = new Map()

  // First, detect symptom groups connected by "and"
  const symptomGroups = detectSymptomGroups(clause)
  console.log('DEBUG collectAreaAliases: symptom groups found:', symptomGroups)

  // Then, check for area relationships (damage showing in one area, source in another)
  const relationships = detectAreaRelationships(clause)
  console.log('DEBUG collectAreaAliases: area relationships:', relationships)
  
  if (relationships && relationships.length > 0) {
    for (const rel of relationships) {
      console.log('DEBUG collectAreaAliases: relationship object:', JSON.stringify(rel, null, 2))
      // Add WORK LOCATION (where plumber goes - e.g., "upstairs bathroom")
      aliasMap.set(rel.workLocation.plumbingIssueLocId, rel.workLocation.alias)
      console.log('DEBUG collectAreaAliases: added WORK LOCATION:', rel.workLocation.plumbingIssueLocId, '->', rel.workLocation.alias)
      
      // Store context location for dispatcher info (e.g., "ceiling" - where damage shows)
      rel.contextLocationId = rel.contextLocation.plumbingIssueLocId
      rel.contextLocationAlias = rel.contextLocation.alias
    }
  }
  
  // Then, check regular aliases (skip if area already has relationship match)
  const usedAreas = relationships && relationships.length > 0 
    ? new Set([
        ...relationships.flatMap(r => [r.workLocation.plumbingIssueLocId, r.contextLocation.plumbingIssueLocId].filter(Boolean)),
        ...relationships.flatMap(r => r.consumedText || [])
      ])
    : new Set()
  
  console.log('DEBUG collectAreaAliases: usedAreas:', Array.from(usedAreas))
  
  // Sort aliases by length (longest first) to prevent overlapping matches
  // Process work locations first (most important), then damage places
  const workEntries = Object.entries(PLUMBING_ISSUE_ITEM_LOOKUP).sort((a, b) => b[0].length - a[0].length)
  const damageEntries = Object.entries(DAMAGE_PLACE_LOOKUP).sort((a, b) => b[0].length - a[0].length)
  const sortedEntries = [...workEntries, ...damageEntries]
  
  for (const [alias, plumbingIssueLocId] of sortedEntries) {
    // Skip if area already has compound match
    if (usedAreas.has(plumbingIssueLocId)) continue
    
    if (!clause.includes(alias.toLowerCase())) continue
    
    // If same area already has a match, only replace if new alias is longer
    if (aliasMap.has(plumbingIssueLocId)) {
      const existingAlias = aliasMap.get(plumbingIssueLocId)
      if (alias.length > existingAlias.length) {
        aliasMap.set(plumbingIssueLocId, alias)
      }
    }
    // If different area, check for overlaps with existing aliases
    else {
      const overlaps = Array.from(aliasMap.values())
        .some(existingAlias => existingAlias.includes(alias))
      if (!overlaps) {
        aliasMap.set(plumbingIssueLocId, alias)
      }
    }
  }
  
  // Convert to objects for compatibility with existing code
  const areaAliases = Array.from(aliasMap.entries()).map(([plumbingIssueLocId, alias]) => ({ plumbingIssueLocId, alias }))
  
  // Add symptom groups to the result for grouped symptom processing
  return { areaAliases, symptomGroups }
}

/**
 * Helper function: collect longest symptom aliases in a clause
 * Keeps the longest alias for each symptom (more specific = better context)
 * Prevents overlapping shorter aliases by processing longest first
 * 
 * @param {string} clause - Text clause to search in
 * @returns {Array} - Array of objects with symptomId and alias
 */
const collectSymptomAliases = (clause) => {
  const aliasMap = new Map()
  
  // Sort aliases by length (longest first) to prevent overlapping matches
  const sortedEntries = Object.entries(SYMPTOM_LOOKUP)
    .sort((a, b) => b[0].length - a[0].length)
  
  for (const [alias, symptomId] of sortedEntries) {
    if (!clause.includes(alias.toLowerCase())) continue
    
    // If same symptom already has a match, only replace if new alias is longer
    if (aliasMap.has(symptomId)) {
      const existingAlias = aliasMap.get(symptomId)
      if (alias.length > existingAlias.length) {
        aliasMap.set(symptomId, alias)
      }
    }
    // If different symptom, check for overlaps with existing aliases
    else {
      const overlaps = Array.from(aliasMap.values())
        .some(existingAlias => existingAlias.includes(alias))
      if (!overlaps) {
        aliasMap.set(symptomId, alias)
      }
    }
  }
  
  // Convert to objects for compatibility with existing code
  return Array.from(aliasMap.entries()).map(([symptomId, alias]) => ({ symptomId, alias }))
}

/**
 * Helper function: collect longest symptom aliases for specific allowed symptom IDs
 * Used to only collect symptoms that are valid for a specific area
 * Prevents overlapping shorter aliases by processing longest first
 * 
 * @param {string} clause - Text clause to search in
 * @param {Set} allowedIds - Set of allowed symptom IDs
 * @returns {Array} - Array of objects with symptomId and alias
 */
const collectSymptomAliasesForIds = (clause, allowedIds) => {
  if (!allowedIds || allowedIds.size === 0) return []
  const aliasMap = new Map()
  
  // Sort aliases by length (longest first) to prevent overlapping matches
  const sortedEntries = Object.entries(SYMPTOM_LOOKUP)
    .sort((a, b) => b[0].length - a[0].length)
  
  for (const [alias, symptomId] of sortedEntries) {
    if (!allowedIds.has(symptomId)) continue
    if (!clause.includes(alias.toLowerCase())) continue
    
    // If same symptom already has a match, only replace if new alias is longer
    if (aliasMap.has(symptomId)) {
      const existingAlias = aliasMap.get(symptomId)
      if (alias.length > existingAlias.length) {
        aliasMap.set(symptomId, alias)
      }
    }
    // If different symptom, check for overlaps with existing aliases
    else {
      const overlaps = Array.from(aliasMap.values())
        .some(existingAlias => existingAlias.includes(alias))
      if (!overlaps) {
        aliasMap.set(symptomId, alias)
      }
    }
  }
  
  return Array.from(aliasMap.entries()).map(([symptomId, alias]) => ({ symptomId, alias }))
}

/**
 * Helper: prune shorter symptom aliases that are substrings of longer ones
 * Example: keep 'no water pressure' and drop 'no water' in same clause
 */
const pruneRedundantSymptomAliases = (items) => {
  if (!items || items.length <= 1) return items || []
  const sorted = items.slice().sort((a, b) => b.alias.length - a.alias.length)
  const kept = []
  for (const cand of sorted) {
    const alias = cand.alias.toLowerCase()
    const overlaps = kept.some(k => k.alias.toLowerCase().includes(alias))
    if (!overlaps) kept.push(cand)
  }
  return kept
}

// ========================================
// CONTEXTUAL MATCHING
// ========================================

/**
 * High-confidence contextual pattern matching
 * 
 * WHAT THIS DOES:
 * Finds exact area+symptom combinations in the same context.
 * This is the most accurate matching method (95% confidence).
 * 
 * HOW IT WORKS:
 * 1. Split input into clauses by natural boundaries (commas, periods, "and")
 * 2. Within each clause, look for area words AND symptom words
 * 3. Only match if both area and symptom appear in the SAME clause
 * 4. Validate that the area+symptom combination exists in our pattern data
 * 
 * EXAMPLE:
 * Input: "The kitchen faucet is leaking and the toilet is running"
 * 
 * Clause 1: "the kitchen faucet is leaking"
 * - Finds: "kitchen faucet" (area) + "leaking" (symptom) 
 * - Result: faucet leak (SAME_DAY priority)
 * 
 * Clause 2: "the toilet is running"  
 * - Finds: "toilet" (area) + "running" (symptom)
 * - Result: toilet running (SCHEDULE priority)
 * 
 * AMBIGUITY SOLVING:
 * - "Bubbling ceiling" = Water damage (emergency)
 * - "Bubbling pipes" = Noise (schedule)  
 * - Same word, different meaning based on context!
 *
 * @param {string} text - Customer's input text
 * @returns {Array} - Array of contextual pattern matches
 */
export function findContextualMatches(text) {
  const matches = []
  const usedAreas = new Set()
  const usedSymptoms = new Set()
  const seenPairs = new Set()

  // Split text into clauses for context
  // NOTE: Don't split on 'and' - we need it for symptom grouping (e.g., "bubbling and sagging")
  const clauses = text
    .split(/[,;.]/)
    .map(c => normalizeText(c.trim()))
    .filter(c => c.length > 0)

  for (const clause of clauses) {
    // Step 1: Collect area aliases and symptom groups
    const { areaAliases: clauseAreas, symptomGroups: clauseSymptomGroups } = collectAreaAliases(clause)

    // Step 2: For each area, collect ONLY valid symptom aliases for that area
    for (const area of clauseAreas) {
      console.log('DEBUG: Processing area:', area)
      const allowed = RULES_BY_AREA.get(area.plumbingIssueLocId) || new Set()
      console.log('DEBUG: Allowed symptoms for area:', Array.from(allowed))
      if (allowed.size === 0) continue

      let clauseSymptomsForArea = collectSymptomAliasesForIds(clause, allowed)
      clauseSymptomsForArea = pruneRedundantSymptomAliases(clauseSymptomsForArea)
      console.log('DEBUG: Found symptoms for area:', clauseSymptomsForArea)

      // Process grouped symptoms (connected by "and")
      const groupedSymptoms = []
      for (const group of clauseSymptomGroups) {
        const validGroupedSymptoms = group.filter(symptom => {
          const symptomId = SYMPTOM_LOOKUP[symptom.toLowerCase()]
          return symptomId && allowed.has(symptomId)
        })
        if (validGroupedSymptoms.length > 1) {
          groupedSymptoms.push(validGroupedSymptoms)
        }
      }
      
      // Remove individual symptoms that are part of groups
      const groupedSymptomIds = new Set(
        groupedSymptoms.flat().map(symptom => SYMPTOM_LOOKUP[symptom.toLowerCase()]).filter(Boolean)
      )
      const individualSymptoms = clauseSymptomsForArea.filter(symptom => !groupedSymptomIds.has(symptom.symptomId))
      
      console.log('DEBUG: Grouped symptoms:', groupedSymptoms)
      console.log('DEBUG: Individual symptoms:', individualSymptoms)

      // Process individual symptoms first
      for (const symptom of individualSymptoms) {
        const key = `${area.plumbingIssueLocId}:${symptom.symptomId}`
        if (seenPairs.has(key)) continue

        const patternEntry = MATCHING_RULES.find(rule =>
          rule.plumbingIssueLocId === area.plumbingIssueLocId && rule.symptomId === symptom.symptomId
        )

        matches.push({
          plumbingIssueLocId: area.plumbingIssueLocId,
          symptomId: symptom.symptomId,
          areaAlias: area.alias,
          symptomAlias: symptom.alias,
          dispatchCategory: getWorkItemCategory(area.plumbingIssueLocId),
          teamSizeRecommendation: getTeamSizeRecommendation(area.plumbingIssueLocId),
          context: `${area.plumbingIssueLocId}_${symptom.symptomId}`,
          pattern: patternEntry?.pattern || null,
          method: 'contextual',
          confidence: 0.95
        })

        usedAreas.add(area.plumbingIssueLocId)
        usedSymptoms.add(symptom.symptomId)
        seenPairs.add(key)
      }
      
      // Process grouped symptoms as combined symptoms on same area
      for (const symptomGroup of groupedSymptoms) {
        const symptomIds = symptomGroup.map(symptom => SYMPTOM_LOOKUP[symptom.toLowerCase()]).filter(Boolean)
        const groupKey = `${area.plumbingIssueLocId}:${symptomIds.join('_and_')}`
        if (seenPairs.has(groupKey)) continue
        
        // Find pattern entries for all symptoms in the group
        const patternEntries = symptomIds.map(symptomId => 
          MATCHING_RULES.find(rule => 
            rule.plumbingIssueLocId === area.plumbingIssueLocId && rule.symptomId === symptomId
          )
        ).filter(Boolean)
        
        // Create combined symptom entry
        matches.push({
          plumbingIssueLocId: area.plumbingIssueLocId,
          symptomId: symptomIds.join('_and_'), // Combined symptom ID
          areaAlias: area.alias,
          symptomAlias: symptomGroup.join(' and '), // Combined symptom display
          dispatchCategory: getWorkItemCategory(area.plumbingIssueLocId),
          teamSizeRecommendation: getTeamSizeRecommendation(area.plumbingIssueLocId),
          context: `${area.plumbingIssueLocId}_${symptomIds.join('_and_')}`,
          pattern: patternEntries.length > 0 ? patternEntries[0].pattern : null,
          method: 'contextual',
          confidence: 0.95,
          isGrouped: true // Mark as grouped symptoms
        })

        // Mark all symptoms in group as used
        symptomIds.forEach(symptomId => usedSymptoms.add(symptomId))
        seenPairs.add(groupKey)
      }
    }

    // Step 3: Collect all symptoms in clause for symptom-only fallbacks
    let clauseSymptomsAll = collectSymptomAliases(clause)
    clauseSymptomsAll = pruneRedundantSymptomAliases(clauseSymptomsAll)

    // Step 4: Add unused symptoms as symptom-only
    for (const symptom of clauseSymptomsAll) {
      if (usedSymptoms.has(symptom.symptomId)) continue
      matches.push({
        plumbingIssueLocId: null,
        symptomId: symptom.symptomId,
        areaAlias: null,
        symptomAlias: symptom.alias,
        context: `symptom_${symptom.symptomId}`,
        pattern: null,
        method: 'symptom_only',
        confidence: 0.75,
        message: `Detected: ${symptom.alias}. Need location for service.`
      })
      usedSymptoms.add(symptom.symptomId)
    }

    // Step 5: Add unused areas as area-only
    for (const area of clauseAreas) {
      if (usedAreas.has(area.plumbingIssueLocId)) continue
      matches.push({
        plumbingIssueLocId: area.plumbingIssueLocId,
        symptomId: null,
        areaAlias: area.alias,
        symptomAlias: null,
        dispatchCategory: getWorkItemCategory(area.plumbingIssueLocId),
        teamSizeRecommendation: getTeamSizeRecommendation(area.plumbingIssueLocId),
        context: `area_${area.plumbingIssueLocId}`,
        pattern: null,
        method: 'area_only',
        confidence: 0.5,
        message: `Found: ${area.alias}. What issue are you experiencing?`
      })
      usedAreas.add(area.plumbingIssueLocId)
    }
  }

  return matches
}

// ========================================
// FALLBACK REGEX MATCHING
// ========================================

/**
 * Find fallback matches using regex when no contextual patterns match
 *
 * WHAT THIS DOES:
 * This is the backup matching system when contextual patterns fail.
 * It uses regex to independently find area words and symptom words,
 * then combines them to find valid area+symptom patterns.
 *
 * WHY THIS EXISTS:
 * Contextual patterns are very specific (require exact area+symptom phrases).
 * Fallback matching is more flexible - it finds ANY area word and ANY
 * symptom word anywhere in the text, then checks if they form a valid combo.
 *
 * TRADE-OFFS:
 * - Less accurate than contextual matching (75% confidence vs 95%)
 * - More flexible (can match partial or unusual phrasing)
 * - Can produce false positives (matches that don't make sense)
 *
 * EXAMPLE:
 * Input: "The faucet is leaking and the toilet is running"
 *
 * Step 1: Find individual words
 * - Area regex finds: "faucet", "toilet"
 * - Symptom regex finds: "leaking", "running"
 *
 * Step 2: Extract unique IDs
 * - Area IDs: {"faucet", "toilet"}
 * - Symptom IDs: {"leak", "running"}
 *
 * Step 3: Find valid patterns from MATCHING_RULES
 * - faucet+leak -> valid
 * - toilet+running -> valid
 * - Result: Returns 2 issues
 *
 * @param {string} text - Customer's input text
 * @returns {Array} - Array of pattern matches found via fallback method
 */
export function findFallbackMatches(text) {
  // Step 1: Find area and symptom words independently using regex
  const areaMatches = findAreaMatches(text)
  const symptomMatches = findSymptomMatches(text)
 
  // Step 2: Extract unique IDs for pattern matching
  const plumbingIssueLocIds = new Set(areaMatches.map(match => match.id))
  const symptomIds = new Set(symptomMatches.map(match => match.id))

  // Step 3: Find patterns where BOTH area AND symptom were detected
  const patterns = []

  for (const entry of MATCHING_RULES) {
    // Skip if we don't have both the area and symptom for this rule
    if (!plumbingIssueLocIds.has(entry.plumbingIssueLocId) || !symptomIds.has(entry.symptomId)) continue

    // Find the actual match objects to get the customer's original words
    const areaMatch = areaMatches.find(match => match.id === entry.plumbingIssueLocId)
    const symptomMatch = symptomMatches.find(match => match.id === entry.symptomId)

    patterns.push({
      plumbingIssueLocId: entry.plumbingIssueLocId,
      symptomId: entry.symptomId,
      areaAlias: areaMatch?.alias || entry.plumbingIssueLocId,
      symptomAlias: symptomMatch?.alias || entry.symptomId,
      dispatchCategory: getWorkItemCategory(entry.plumbingIssueLocId),
      teamSizeRecommendation: getTeamSizeRecommendation(entry.plumbingIssueLocId),
      pattern: entry.pattern,  // Contains job type, severity, etc.
      method: 'fallback',
      confidence: 0.75
    })
  }

  return patterns
}

/**
 * Fallback: Standard regex matching
 */
const collectRegexMatches = (text, regex, lookup) => {
  const normalizedText = normalizeText(text)
  const raw = []
  for (const match of normalizedText.matchAll(regex)) {
    const alias = match[0].toLowerCase()
    const id = lookup[alias]
    if (!id) continue
    raw.push({
      id,
      alias,
      start: match.index,
      end: match.index + match[0].length,
      len: match[0].length,
      confidence: 0.6
    })
  }

  // Prefer longer phrases and avoid overlapping spans
  raw.sort((a, b) => b.len - a.len)
  const accepted = []
  const seenIds = new Set()

  const overlaps = (a, b) => !(a.end <= b.start || b.end <= a.start)

  for (const cand of raw) {
    if (seenIds.has(cand.id)) continue
    if (accepted.some(x => overlaps(x, cand))) continue
    accepted.push(cand)
    seenIds.add(cand.id)
  }

  // Drop helper len before returning
  return accepted.map(({ len, ...rest }) => rest)
}

export function findAreaMatches(text) {
  // Find matches from both work locations and damage places
  // Prioritize work locations (where plumber actually works)
  const workLocationMatches = collectRegexMatches(text, PLUMBING_LOCATION_REGEX, PLUMBING_ISSUE_ITEM_LOOKUP)
  const damageMatches = collectRegexMatches(text, DAMAGE_PLACE_REGEX, DAMAGE_PLACE_LOOKUP)
  
  // Combine and deduplicate by ID
  const combined = [...workLocationMatches, ...damageMatches]
  const seen = new Set()
  return combined.filter(match => {
    if (seen.has(match.id)) return false
    seen.add(match.id)
    return true
  })
}

export function findSymptomMatches(text) {
  return collectRegexMatches(text, SYMPTOM_REGEX, SYMPTOM_LOOKUP)
}

// ========================================
// MAIN ORCHESTRATOR
// ========================================

/**
 * Main pattern finding function with ambiguity detection
 *
 * WHAT THIS DOES:
 * This is the orchestrator that tries different matching strategies in order:
 * 1. Contextual matching (most accurate, requires area+symptom context)
 * 2. Fallback matching (less accurate, more flexible)
 * 3. Ambiguous handling (asks for clarification)
 *
 * WHY THIS EXISTS:
 * Different customer inputs require different approaches. Some customers
 * give clear context ("The ceiling is bubbling"), others give vague input
 * ("I have a leak"). This function handles all cases appropriately.
 *
 * MATCHING STRATEGY:
 * - Try the most accurate method first (contextual)
 * - Fall back to more flexible method if needed (fallback)
 * - Ask for clarification if nothing matches (ambiguous)
 *
 * EXAMPLE SCENARIOS:
 *
 * Scenario 1: Clear context
 * Input: "The ceiling is bubbling"
 * -> Contextual match: ceiling + bubbling
 * -> Returns: water damage issue (IMMEDIATE)
 *
 * Scenario 2: Partial information
 * Input: "The faucet is leaking and the toilet is running"
 * -> Contextual: No exact pattern matches
 * -> Fallback: Finds "faucet" + "leak", "toilet" + "running"
 * -> Returns: 2 issues (SAME_DAY, SCHEDULE)
 *
 * Scenario 3: Too vague
 * Input: "I have a leak"
 * -> Contextual: No pattern matches
 * -> Fallback: No area found, only symptom
 * -> Ambiguous: Asks for clarification
 * -> Returns: "Where is the leak?"
 *
 * CONFIDENCE LEVELS:
 * - Contextual: 95% (very accurate)
 * - Fallback: 75% (moderately accurate)
 * - Ambiguous: 10% (needs clarification)
 *
 * @param {string} text - Customer's input text
 * @returns {Array} - Array of pattern matches or ambiguous response
 */
export function findPatterns(text) {
  // 1. Try contextual matching first (most accurate)
  const contextualMatches = findContextualMatches(text)

  if (contextualMatches.length > 0) {
    return contextualMatches
  }

  // 2. Try fallback matching (area + symptom combinations)
  const fallbackMatches = findFallbackMatches(text)

  if (fallbackMatches.length > 0) {
    return fallbackMatches
  }

  // 3. Handle ambiguous input - no clear patterns found
  // Return a special ambiguous result instead of useless symptom-only matches
  return [{
    plumbingIssueLocId: null,
    symptomId: null,
    areaAlias: null,
    symptomAlias: null,
    context: 'ambiguous_input',
    pattern: null,
    method: 'ambiguous',
    message: 'Input is too ambiguous. Please provide more specific information about the location and issue.',
    suggestions: [
      'Where is the issue occurring? (e.g., kitchen faucet, bathroom ceiling)',
      'What specific problem are you experiencing? (e.g., leaking, bubbling, running)',
      'Can you describe the affected fixture or area?'
    ]
  }]
}

/**
 * Debug function to show what would be matched
 */
export function debugMatches(text) {
  return {
    areas: findAreaMatches(text),
    symptoms: findSymptomMatches(text),
    patterns: findPatterns(text)
  }
}

// Export helper functions for testing
export { collectAreaAliases }
