// Basic AI Learner - Our First AI That Learns Patterns!
// Explained like 5-year-old: This is our baby AI that learns to recognize plumbing problems!

import JOB_TYPES from '../../data/jobTypes.json'
import AI_KEYWORDS from '../../data/aiKeywords.json'

/**
 * 🤖 Magic Word Box - Suggests job types from customer descriptions
 * 
 * @param {string} customerText - What the customer says
 * @returns {object} - { issues: [], primaryIssue: {}, totalIssues: number }
 */
export const suggestJobType = (customerText) => {
  if (!customerText || typeof customerText !== 'string') {
    return { issues: [], primaryIssue: null, totalIssues: 0 }
  }

  //  ð AI Keywords - Imported from data/aiKeywords.json
  // Organized by job type for better maintainability

  //  ð Look for keywords (case-insensitive)
  const lowerText = customerText.toLowerCase()
  
  //  ð Check each keyword and deduplicate in one pass
  const deduplicatedIssues = []
  
  for (const [word, jobType] of Object.entries(AI_KEYWORDS)) {
    if (lowerText.includes(word)) {
      const confidence = word.length > 5 ? 0.8 : 0.6 // Longer words = more confident
      
      // Check if this keyword is unique (not redundant with existing)
      const isUnique = deduplicatedIssues.every(existing =>
        !existing.keyword.includes(word) && !word.includes(existing.keyword)
      )
      
      if (isUnique) {
        deduplicatedIssues.push({
          category: jobType,
          keyword: word,
          confidence
        })
      }
    }
  }

  //  ð Get priority level for each issue
  const getPriorityLevel = (category) => {
    if (category === 'gas_line_services' || category === 'emergency_plumbing') return 'IMMEDIATE'
    if (category === 'water_heater_services' || category === 'drain_cleaning_sewer') return 'SAME_DAY'
    return 'SCHEDULE'
  }

  //  ð Group issues by priority level
  const groupedIssues = {
    IMMEDIATE: [],
    SAME_DAY: [],
    SCHEDULE: []
  }

  for (const issue of deduplicatedIssues) {
    const priority = getPriorityLevel(issue.category)
    groupedIssues[priority].push(issue)
  }

  //  ð Sort each group by confidence (highest first)
  for (const priority in groupedIssues) {
    groupedIssues[priority].sort((a, b) => b.confidence - a.confidence)
  }

  //  ð Return grouped issues
  return {
    issues: deduplicatedIssues,
    groupedIssues,
    primaryIssue: deduplicatedIssues[0] || null,
    totalIssues: deduplicatedIssues.length
  }
}

/**
 * 🎯 Get job type details from category
 * 
 * @param {string} jobTypeId - The job type ID
 * @returns {object} - Job type details or null
 */
export const getJobTypeDetails = (jobTypeId) => {
  if (!jobTypeId) return null
  
  return JOB_TYPES.find(job => job.id === jobTypeId) || null
}

/**
 * 🤖 Enhanced AI Suggestion - With job type details
 * 
 * @param {string} customerText - What the customer says
 * @returns {object} - Complete suggestion with details
 */
export const getAISuggestion = (customerText) => {
  const suggestion = suggestJobType(customerText)
  
  if (suggestion.totalIssues === 0) {
    return {
      ...suggestion,
      jobDetails: null,
      message: 'No specific job type detected'
    }
  }

  const jobDetails = getJobTypeDetails(suggestion.primaryIssue.category)
  
  return {
    ...suggestion,
    jobDetails,
    message: suggestion.totalIssues === 1 
      ? `AI suggests: ${jobDetails?.name || 'Unknown'}`
      : `AI detected ${suggestion.totalIssues} issues: ${suggestion.primaryIssue.category} + ${suggestion.totalIssues - 1} more`
  }
}
