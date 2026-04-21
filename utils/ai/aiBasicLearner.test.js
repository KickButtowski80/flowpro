// TEST VERSION - Uses contextual matching instead of flat regex
import jobTypes from '../../data/jobTypes.json'
import SYMPTOMS from '../../data/symptoms.test.json'
import { findPatterns, debugMatches } from './lookupMaps.test.js'

/**
 * TEST VERSION: Uses contextual pattern matching to solve ambiguity issues
 */
export const suggestJobType = (customerText) => {
  console.log('=== AI BASIC LEARNER TEST ===')
  console.log('Customer text:', customerText)
  
  // Use contextual pattern matching
  const matches = findPatterns(customerText)
 
  console.log('Matches detected:', matches)
  
  if (matches.length === 0) {
    console.log('No matches detected')
    return {
      issues: [],
      groupedIssues: {
        IMMEDIATE: [],
        SAME_DAY: [],
        SCHEDULE: []
      },
      totalIssues: 0
    }
  }

  // Convert matches to issues
  const issues = matches.map((match, index) => {
    // Handle ambiguous input specially
    if (match.method === 'ambiguous') {
      return {
        id: `issue-${index + 1}`,
        jobType: null,
        jobTypeTitle: 'Clarification Needed',
        area: null,
        symptom: null,
        areaAlias: null,
        symptomAlias: null,
        severity: 'schedule',
        confidence: 0.1, // Very low confidence
        description: match.message,
        detectedBy: 'ambiguous',
        pattern: null,
        suggestions: match.suggestions
      }
    }
    
    // Handle normal matches
    let jobType = null
    let jobTypeId = null
    
    if (match.pattern) {
      // Pattern match - get job type from pattern
      jobTypeId = match.pattern.jobType
      jobType = jobTypes.find(jt => jt.id === jobTypeId)
    } else if (match.method === 'fallback_symptom_only') {
      // Symptom-only match - no job type available
      console.log('Symptom-only match - no job type assigned')
    } else {
      // Fallback - try direct job type
      jobTypeId = match.jobType
      jobType = jobTypes.find(jt => jt.id === jobTypeId)
    }
    
    // Get severity from symptom defaults for symptom-only matches
    let severity = 'schedule' // default
    
    if (match.method === 'fallback_symptom_only') {
      // For symptom-only matches, get severity from symptom data
      const symptomData = SYMPTOMS.find(s => s.id === match.symptomId)
      if (symptomData) {
        severity = symptomData.severity
      }
    } else {
      // For pattern matches, get severity from pattern overrides
      const patternData = match.pattern || match
      if (patternData.severityOverrides && patternData.severityOverrides[match.symptomId]) {
        severity = patternData.severityOverrides[match.symptomId]
      }
    }

    return {
      id: `issue-${index + 1}`,
      jobType: jobTypeId,
      jobTypeTitle: jobType?.name || (jobTypeId ? 'Unknown Job Type' : 'No Job Type Assigned'),
      area: match.areaId,
      symptom: match.symptomId,
      areaAlias: match.areaAlias || 'Unknown Area',
      symptomAlias: match.symptomAlias,
      severity,
      confidence: match.method === 'contextual' ? 0.95 : match.method === 'fallback' ? 0.75 : 0.1,
      description: match.areaAlias ? `${match.areaAlias} ${match.symptomAlias}` : match.symptomAlias,
      detectedBy: match.method, // Shows which method was used
      pattern: match.pattern // Keep the pattern reference for UI
    }
  })

  // Filter out null issues (from job type not found)
  const validIssues = issues.filter(issue => issue !== null)

  // Group by severity
  const groupedIssues = {
    IMMEDIATE: validIssues.filter(issue => issue.severity === 'immediate'),
    SAME_DAY: validIssues.filter(issue => issue.severity === 'same_day'), 
    SCHEDULE: validIssues.filter(issue => issue.severity === 'schedule')
  }

  const result = {
    issues: validIssues,
    groupedIssues,
    totalIssues: validIssues.length
  }

  console.log('Final result:', result)
  console.log('==========================')
  
  return result
}

/**
 * Wrapper function with job type details
 */
export const getAISuggestion = (customerText) => {
  const suggestion = suggestJobType(customerText)
  
  // Add job type details to all issues if available
  if (suggestion.issues && suggestion.issues.length > 0) {
    suggestion.issues.forEach(issue => {
      if (issue.jobType) {
        const jobDetails = jobTypes.find(jt => jt.id === issue.jobType)
        issue.jobTypeDetails = jobDetails
      }
    })
  }
  
  return suggestion
}

/**
 * Debug function
 */
export const debugAISuggestion = (customerText) => {
  debugMatches(customerText)
  return getAISuggestion(customerText)
}
