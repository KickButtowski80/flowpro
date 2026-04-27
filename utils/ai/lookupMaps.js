// ========================================
// AI PATTERN MATCHING SYSTEM
// ========================================

import ISSUE_AREAS from '../../data/issueAreas.js'
import SYMPTOMS from '../../data/symptoms.js'
import AREA_JOB_CONFIGS from '../../data/areaJobConfigs.json'
import { findAreaInText, buildAreaFirstPatterns, processAreaFirstMatches, deduplicateCompounds } from './compoundLocationHelpers.js'

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
export const AREA_LOOKUP = {}
export const SYMPTOM_LOOKUP = {}

// Build area lookup map from aliases
ISSUE_AREAS.forEach(area => {
  area.aliases.forEach(alias => {
    AREA_LOOKUP[alias.toLowerCase()] = area.id
  })
})

// Build symptom lookup map from aliases
SYMPTOMS.forEach(symptom => {
  symptom.aliases.forEach(alias => {
    SYMPTOM_LOOKUP[alias.toLowerCase()] = symptom.id
  })
})

// ========================================
// REGEX PATTERNS
// ========================================

// Build comprehensive regex patterns from all aliases
const AREA_WORDS = Object.keys(AREA_LOOKUP).join('|')
const SYMPTOM_WORDS = Object.keys(SYMPTOM_LOOKUP).join('|')

export const AREA_REGEX = new RegExp(`\\b(${AREA_WORDS})\\b`, 'gi')
export const SYMPTOM_REGEX = new RegExp(`\\b(${SYMPTOM_WORDS})\\b`, 'gi')

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
        areaId: areaJobConfig.area,       // e.g., "toilet" 
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
  for (const { areaId, symptomId } of MATCHING_RULES) {
    if (!byArea.has(areaId)) byArea.set(areaId, new Set())
    byArea.get(areaId).add(symptomId)
  }
  return byArea
})()

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Detects relationships between two areas: where work is done vs where problem shows
 * NOTE: Both are looked up in AREA_LOOKUP (they're all "areas")
 * The distinction is semantic: work location vs context location
 * 
 * Example: "ceiling from upstairs bathroom"
 * - workLocation: upstairs bathroom (where plumber goes to fix)
 * - contextLocation: ceiling (where damage is visible - extra context)
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
  
  // Build patterns
  const patterns = buildAreaFirstPatterns(AREA_LOOKUP)
  
  // Process matches
  let relationships = processAreaFirstMatches(text, patterns, AREA_LOOKUP)
  
  // Deduplicate
  relationships = deduplicateCompounds(relationships)
  
  console.log('DEBUG: Final area relationships:', JSON.stringify(relationships, null, 2))
  return relationships
}

/**
 * Helper function: collect longest area aliases in a clause
 * Keeps the longest alias for each area (more specific = better context)
 * Prevents overlapping shorter aliases by processing longest first
 * Checks for area relationships first (e.g., "ceiling from upstairs bathroom")
 * 
 * @param {string} clause - Text clause to search in
 * @returns {Array} - Array of objects with areaId and alias
 */
const collectAreaAliases = (clause) => {
  const aliasMap = new Map()

  // First, check for area relationships (damage showing in one area, source in another)
  const relationships = detectAreaRelationships(clause)
  console.log('DEBUG collectAreaAliases: area relationships:', relationships)
  
  if (relationships && relationships.length > 0) {
    for (const rel of relationships) {
      // Add WORK LOCATION (where plumber goes - e.g., "upstairs bathroom")
      aliasMap.set(rel.workLocation.areaId, rel.workLocation.alias)
      console.log('DEBUG collectAreaAliases: added WORK LOCATION:', rel.workLocation.areaId, '->', rel.workLocation.alias)
      
      // Store context location for dispatcher info (e.g., "ceiling" - where damage shows)
      rel.contextLocationId = rel.contextLocation.areaId
      rel.contextLocationAlias = rel.contextLocation.alias
    }
  }
  
  // Then, check regular aliases (skip if area already has relationship match)
  const usedAreas = relationships && relationships.length > 0 
    ? new Set(relationships.flatMap(r => [r.workLocation.areaId, r.contextLocation.areaId].filter(Boolean)))
    : new Set()
  
  console.log('DEBUG collectAreaAliases: usedAreas:', Array.from(usedAreas))
  
  // Sort aliases by length (longest first) to prevent overlapping matches
  const sortedEntries = Object.entries(AREA_LOOKUP)
    .sort((a, b) => b[0].length - a[0].length)
  
  for (const [alias, areaId] of sortedEntries) {
    // Skip if area already has compound match
    if (usedAreas.has(areaId)) continue
    
    if (!clause.includes(alias.toLowerCase())) continue
    
    // If same area already has a match, only replace if new alias is longer
    if (aliasMap.has(areaId)) {
      const existingAlias = aliasMap.get(areaId)
      if (alias.length > existingAlias.length) {
        aliasMap.set(areaId, alias)
      }
    }
    // If different area, check for overlaps with existing aliases
    else {
      const overlaps = Array.from(aliasMap.values())
        .some(existingAlias => existingAlias.includes(alias))
      if (!overlaps) {
        aliasMap.set(areaId, alias)
      }
    }
  }
  
  // Convert to objects for compatibility with existing code
  return Array.from(aliasMap.entries()).map(([areaId, alias]) => ({ areaId, alias }))
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
  const clauses = text
    .split(/[,;.]|\band\b/i)
    .map(c => normalizeText(c.trim()))
    .filter(c => c.length > 0)

  for (const clause of clauses) {
    // Step 1: Collect area aliases
    const clauseAreas = collectAreaAliases(clause)

    // Step 2: For each area, collect ONLY valid symptom aliases for that area
    for (const area of clauseAreas) {
      console.log('DEBUG: Processing area:', area)
      const allowed = RULES_BY_AREA.get(area.areaId) || new Set()
      console.log('DEBUG: Allowed symptoms for area:', Array.from(allowed))
      if (allowed.size === 0) continue

      let clauseSymptomsForArea = collectSymptomAliasesForIds(clause, allowed)
      clauseSymptomsForArea = pruneRedundantSymptomAliases(clauseSymptomsForArea)
      console.log('DEBUG: Found symptoms for area:', clauseSymptomsForArea)

      for (const symptom of clauseSymptomsForArea) {
        const key = `${area.areaId}:${symptom.symptomId}`
        if (seenPairs.has(key)) continue

        const patternEntry = MATCHING_RULES.find(rule =>
          rule.areaId === area.areaId && rule.symptomId === symptom.symptomId
        )

        matches.push({
          areaId: area.areaId,
          symptomId: symptom.symptomId,
          areaAlias: area.alias,
          symptomAlias: symptom.alias,
          context: `${area.areaId}_${symptom.symptomId}`,
          pattern: patternEntry?.pattern || null,
          method: 'contextual',
          confidence: 0.95
        })

        usedAreas.add(area.areaId)
        usedSymptoms.add(symptom.symptomId)
        seenPairs.add(key)
      }
    }

    // Step 3: Collect all symptoms in clause for symptom-only fallbacks
    let clauseSymptomsAll = collectSymptomAliases(clause)
    clauseSymptomsAll = pruneRedundantSymptomAliases(clauseSymptomsAll)

    // Step 4: Add unused symptoms as symptom-only
    for (const symptom of clauseSymptomsAll) {
      if (usedSymptoms.has(symptom.symptomId)) continue
      matches.push({
        areaId: null,
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
      if (usedAreas.has(area.areaId)) continue
      matches.push({
        areaId: area.areaId,
        symptomId: null,
        areaAlias: area.alias,
        symptomAlias: null,
        context: `area_${area.areaId}`,
        pattern: null,
        method: 'area_only',
        confidence: 0.5,
        message: `Found: ${area.alias}. What issue are you experiencing?`
      })
      usedAreas.add(area.areaId)
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
  const areaIds = new Set(areaMatches.map(match => match.id))
  const symptomIds = new Set(symptomMatches.map(match => match.id))

  // Step 3: Find patterns where BOTH area AND symptom were detected
  const patterns = []

  for (const entry of MATCHING_RULES) {
    // Skip if we don't have both the area and symptom for this rule
    if (!areaIds.has(entry.areaId) || !symptomIds.has(entry.symptomId)) continue

    // Find the actual match objects to get the customer's original words
    const areaMatch = areaMatches.find(match => match.id === entry.areaId)
    const symptomMatch = symptomMatches.find(match => match.id === entry.symptomId)

    patterns.push({
      areaId: entry.areaId,
      symptomId: entry.symptomId,
      areaAlias: areaMatch?.alias || entry.areaId,
      symptomAlias: symptomMatch?.alias || entry.symptomId,
      pattern: entry.pattern,  // Contains job type, severity, etc.
      method: 'fallback'
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
  return collectRegexMatches(text, AREA_REGEX, AREA_LOOKUP)
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
    areaId: null,
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
