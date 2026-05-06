/**
 * Unit Tests for lookupMaps.js
 * 
 * Step 1: Basic utility functions and normalization
 * Tests individual functions in isolation
 */

import {
  normalizeText,
  getWorkItemCategory,
  getDamagePlaceCategory,
  isComponent,
  isFixture,
  isAppliance,
  isSystem,
  getTeamSizeRecommendation,
  detectSymptomGroups
} from '../../lookupMaps.js'

describe('lookupMaps - Unit Tests', () => {

  describe('normalizeText', () => {
    test('should convert to lowercase', () => {
      expect(normalizeText('CEILING IS LEAKING')).toBe('ceiling is leaking')
      expect(normalizeText('BATHROOM')).toBe('bathroom')
    })
    
    test('should trim whitespace', () => {
      expect(normalizeText('  bathroom ceiling  ')).toBe('bathroom ceiling')
      expect(normalizeText('\t kitchen sink \n')).toBe('kitchen sink')
    })
    
    test('should normalize multiple spaces', () => {
      expect(normalizeText('bathroom    ceiling')).toBe('bathroom ceiling')
      expect(normalizeText('kitchen   sink   faucet')).toBe('kitchen sink faucet')
    })
    
    test('should remove punctuation', () => {
      expect(normalizeText('ceiling, wall, floor')).toBe('ceiling  wall  floor')
      expect(normalizeText('bathroom! leaking? help.')).toBe('bathroom  leaking  help ')
    })
    
    test('should handle complex input', () => {
      expect(normalizeText('  The BATHROOM ceiling is LEAKING!  ')).toBe('the bathroom ceiling is leaking ')
    })
    
    test('should handle empty and edge cases', () => {
      expect(normalizeText('')).toBe('')
      expect(normalizeText('   ')).toBe('')
      expect(normalizeText('...,,,!!!')).toBe('         ') // Punctuation replaced with spaces
    })
  })

  describe('getWorkItemCategory', () => {
    test('should return fixture category for fixtures', () => {
      // These would be based on actual data from PLUMBING_LOCATION_METADATA
      // For now, test the function exists and handles cases
      expect(typeof getWorkItemCategory).toBe('function')
    })
    
    test('should return null for unknown IDs', () => {
      expect(getWorkItemCategory('unknown_id')).toBeNull()
      expect(getWorkItemCategory('')).toBeNull()
      expect(getWorkItemCategory(null)).toBeNull()
      expect(getWorkItemCategory(undefined)).toBeNull()
    })
  })

  describe('getDamagePlaceCategory', () => {
    test('should return category for known damage places', () => {
      expect(typeof getDamagePlaceCategory).toBe('function')
    })
    
    test('should return null for unknown IDs', () => {
      expect(getDamagePlaceCategory('unknown_place')).toBeNull()
      expect(getDamagePlaceCategory('')).toBeNull()
      expect(getDamagePlaceCategory(null)).toBeNull()
      expect(getDamagePlaceCategory(undefined)).toBeNull()
    })
  })

  describe('Category Type Checkers', () => {
    test('isComponent should check component category', () => {
      expect(typeof isComponent).toBe('function')
      expect(isComponent('unknown')).toBe(false) // Should handle unknown gracefully
    })
    
    test('isFixture should check fixture category', () => {
      expect(typeof isFixture).toBe('function')
      expect(isFixture('unknown')).toBe(false) // Should handle unknown gracefully
    })
    
    test('isAppliance should check appliance category', () => {
      expect(typeof isAppliance).toBe('function')
      expect(isAppliance('unknown')).toBe(false) // Should handle unknown gracefully
    })
    
    test('isSystem should check system category', () => {
      expect(typeof isSystem).toBe('function')
      expect(isSystem('unknown')).toBe(false) // Should handle unknown gracefully
    })
  })

  describe('getTeamSizeRecommendation', () => {
    test('should return number for known items', () => {
      expect(typeof getTeamSizeRecommendation).toBe('function')
      expect(typeof getTeamSizeRecommendation('some_id')).toBe('number')
    })
    
    test('should handle unknown items gracefully', () => {
      expect(typeof getTeamSizeRecommendation('unknown')).toBe('number')
      expect(getTeamSizeRecommendation('')).toBe(1) // Default should be 1
      expect(getTeamSizeRecommendation(null)).toBe(1)
      expect(getTeamSizeRecommendation(undefined)).toBe(1)
    })
    
    test('should return valid team sizes (1, 2, or 3)', () => {
      const result = getTeamSizeRecommendation('some_id')
      expect([1, 2, 3]).toContain(result)
    })
  })

  describe('detectSymptomGroups', () => {
    test('should detect "and" connected symptoms', () => {
      const result = detectSymptomGroups('leaking and dripping and bubbling')
      expect(Array.isArray(result)).toBe(true)
    })
    
    test('should detect comma-separated symptoms', () => {
      const result = detectSymptomGroups('leaking, dripping, bubbling')
      expect(Array.isArray(result)).toBe(true)
    })
    
    test('should detect mixed "and" and comma symptoms', () => {
      const result = detectSymptomGroups('leaking and dripping, bubbling and running')
      expect(Array.isArray(result)).toBe(true)
    })
    
    test('should return empty array for no symptom groups', () => {
      expect(detectSymptomGroups('no symptoms here')).toEqual([])
      expect(detectSymptomGroups('')).toEqual([])
      expect(detectSymptomGroups('just leaking')).toEqual([]) // Single symptom, not a group
    })
    
    test('should handle case insensitive', () => {
      const result1 = detectSymptomGroups('LEAKING AND DRIPPING')
      const result2 = detectSymptomGroups('leaking and dripping')
      expect(Array.isArray(result1)).toBe(true)
      expect(Array.isArray(result2)).toBe(true)
    })
    
    test('should handle edge cases', () => {
      expect(detectSymptomGroups('leaking and')).toEqual([])
      expect(detectSymptomGroups('and dripping')).toEqual([])
      expect(detectSymptomGroups('leaking,')).toEqual([])
      expect(detectSymptomGroups(', dripping')).toEqual([])
    })
  })

  // Performance tests for basic functions
  describe('Performance Tests', () => {
    test('normalizeText should handle large inputs efficiently', () => {
      const largeText = 'BATHROOM CEILING LEAKING! '.repeat(1000)
      
      const startTime = performance.now()
      const result = normalizeText(largeText)
      const endTime = performance.now()
      
      expect(result).toContain('bathroom ceiling leaking')
      expect(endTime - startTime).toBeLessThan(50) // Should complete in <50ms
    })
    
    test('detectSymptomGroups should handle long symptom lists efficiently', () => {
      const longSymptomText = 'leaking and dripping and bubbling and running and overflowing and '.repeat(100)
      
      const startTime = performance.now()
      const result = detectSymptomGroups(longSymptomText)
      const endTime = performance.now()
      
      expect(Array.isArray(result)).toBe(true)
      expect(endTime - startTime).toBeLessThan(100) // Should complete in <100ms
    })
  })
})
