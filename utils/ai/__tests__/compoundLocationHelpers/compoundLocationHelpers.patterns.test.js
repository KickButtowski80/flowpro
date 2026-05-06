/**
 * Pattern Tests for compoundLocationHelpers.js
 * 
 * Tests the pattern building and connection finding functions
 * Uses minimal mock data to avoid memory issues
 */

import {
  buildAreaRelationshipPatterns,
  buildReverseDirectionPatterns,
  findAreaConnectionsInText,
  findReverseDirectionConnections,
  deduplicateCompounds
} from '../compoundLocationHelpers.js'

// Minimal mock data for pattern testing
const MINIMAL_LOOKUP = {
  'bathroom': 'bathroom',
  'kitchen': 'kitchen',
  'ceiling': 'ceiling',
  'wall': 'wall',
  'floor': 'floor',
  'toilet': 'toilet',
  'faucet': 'faucet',
  'sink': 'sink',
  'upstairs bathroom': 'upstairs_bathroom'
}

describe('compoundLocationHelpers - Pattern Tests', () => {

  describe('buildAreaRelationshipPatterns', () => {
    test('should build patterns for forward detection', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      
      expect(patterns).toHaveLength(Object.keys(MINIMAL_LOOKUP).length)
      
      // Check that patterns include prepositions
      const bathroomPattern = patterns.find(p => p.id === 'bathroom')
      expect(bathroomPattern).toBeDefined()
      expect(bathroomPattern.pattern).toMatch(/from|in|under|behind|above|below|at|on/)
      expect(bathroomPattern.id).toBe('bathroom')
    })
    
    test('should handle compound locations', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      
      const upstairsBathroomPattern = patterns.find(p => p.id === 'upstairs_bathroom')
      expect(upstairsBathroomPattern).toBeDefined()
      expect(upstairsBathroomPattern.pattern).toMatch(/from|in|under|behind|above|below|at|on/)
    })
    
    test('should handle empty lookup', () => {
      const patterns = buildAreaRelationshipPatterns({})
      expect(patterns).toEqual([])
    })
    
    test('should create valid regex patterns', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      
      patterns.forEach(pattern => {
        expect(pattern.pattern).toBeInstanceOf(RegExp)
        expect(pattern.id).toBeDefined()
        expect(typeof pattern.id).toBe('string')
      })
    })
  })

  describe('buildReverseDirectionPatterns', () => {
    test('should build patterns for reverse detection', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      
      expect(patterns).toHaveLength(Object.keys(MINIMAL_LOOKUP).length)
      
      // Check that patterns include reverse verbs
      const bathroomPattern = patterns.find(p => p.id === 'bathroom')
      expect(bathroomPattern).toBeDefined()
      expect(bathroomPattern.pattern).toMatch(/leaking|dripping|burst|overflowing|running|has|have|with|shows|showing/)
      expect(bathroomPattern.id).toBe('bathroom')
    })
    
    test('should handle compound locations', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      
      const upstairsBathroomPattern = patterns.find(p => p.id === 'upstairs_bathroom')
      expect(upstairsBathroomPattern).toBeDefined()
      expect(upstairsBathroomPattern.pattern).toMatch(/leaking|dripping|burst|overflowing|running|has|have|with|shows|showing/)
    })
    
    test('should handle empty lookup', () => {
      const patterns = buildReverseDirectionPatterns({})
      expect(patterns).toEqual([])
    })
    
    test('should create valid regex patterns', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      
      patterns.forEach(pattern => {
        expect(pattern.pattern).toBeInstanceOf(RegExp)
        expect(pattern.id).toBeDefined()
        expect(typeof pattern.id).toBe('string')
      })
    })
  })

  describe('findAreaConnectionsInText', () => {
    test('should find forward connections', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText('leak from ceiling', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
      expect(connections[0].contextLocation.plumbingIssueLocId).toBe('ceiling')
      expect(connections[0].workLocation.alias).toBe('ceiling')
      expect(connections[0].contextLocation.alias).toBe('ceiling')
    })
    
    test('should find multiple connections', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText('leak from ceiling and water in basement', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1) // Only ceiling found, basement not in minimal lookup
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
    })
    
    test('should handle compound locations', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText('leak from upstairs bathroom', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('upstairs_bathroom')
      expect(connections[0].workLocation.alias).toBe('upstairs bathroom')
    })
    
    test('should handle different prepositions', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      
      const fromConnection = findAreaConnectionsInText('water from sink', patterns, MINIMAL_LOOKUP)
      const inConnection = findAreaConnectionsInText('leak in bathroom', patterns, MINIMAL_LOOKUP)
      const underConnection = findAreaConnectionsInText('damage under cabinet', patterns, MINIMAL_LOOKUP)
      
      expect(fromConnection[0].workLocation.plumbingIssueLocId).toBe('sink')
      expect(inConnection[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(underConnection).toEqual([]) // cabinet not in minimal lookup
    })
    
    test('should return empty for no matches', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText('random text with no locations', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toEqual([])
    })
    
    test('should handle case insensitive matching', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText('LEAK FROM CEILING', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
    })
  })

  describe('findReverseDirectionConnections', () => {
    test('should find reverse connections', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      const connections = findReverseDirectionConnections('ceiling is leaking', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
      expect(connections[0].contextLocation.plumbingIssueLocId).toBe('ceiling')
      expect(connections[0].workLocation.alias).toBe('ceiling')
      expect(connections[0].contextLocation.alias).toBe('ceiling')
    })
    
    test('should find multiple reverse connections', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      const connections = findReverseDirectionConnections('ceiling is leaking and wall burst', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1) // Only ceiling found with "is leaking", wall not found with "burst"
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
    })
    
    test('should handle compound locations', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      const connections = findReverseDirectionConnections('upstairs bathroom has water damage', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('upstairs_bathroom')
      expect(connections[0].workLocation.alias).toBe('upstairs bathroom')
    })
    
    test('should handle different reverse verbs', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      
      const leakingConnection = findReverseDirectionConnections('faucet is leaking', patterns, MINIMAL_LOOKUP)
      const hasConnection = findReverseDirectionConnections('toilet has problem', patterns, MINIMAL_LOOKUP)
      const withConnection = findReverseDirectionConnections('sink with issue', patterns, MINIMAL_LOOKUP)
      
      expect(leakingConnection[0].workLocation.plumbingIssueLocId).toBe('faucet')
      expect(hasConnection[0].workLocation.plumbingIssueLocId).toBe('toilet')
      expect(withConnection[0].workLocation.plumbingIssueLocId).toBe('sink')
    })
    
    test('should return empty for no matches', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      const connections = findReverseDirectionConnections('random text with no locations', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toEqual([])
    })
    
    test('should handle case insensitive matching', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      const connections = findReverseDirectionConnections('CEILING IS LEAKING', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
    })
  })

  describe('deduplicateCompounds', () => {
    test('should remove duplicate connections', () => {
      const connections = [
        { workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { workLocation: { plumbingIssueLocId: 'kitchen' }, contextLocation: { plumbingIssueLocId: 'wall' } }
      ]
      
      const deduplicated = deduplicateCompounds(connections)
      expect(deduplicated).toHaveLength(2)
      expect(deduplicated.map(c => c.workLocation.plumbingIssueLocId)).toEqual(['bathroom', 'kitchen'])
    })
    
    test('should handle empty array', () => {
      expect(deduplicateCompounds([])).toEqual([])
    })
    
    test('should preserve unique connections', () => {
      const connections = [
        { workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { workLocation: { plumbingIssueLocId: 'kitchen' }, contextLocation: { plumbingIssueLocId: 'wall' } },
        { workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'floor' } }
      ]
      
      const deduplicated = deduplicateCompounds(connections)
      expect(deduplicated).toHaveLength(3) // All are unique
    })
    
    test('should handle complex duplicates', () => {
      const connections = [
        { workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { workLocation: { plumbingIssueLocId: 'kitchen' }, contextLocation: { plumbingIssueLocId: 'wall' } },
        { workLocation: { plumbingIssueLocId: 'kitchen' }, contextLocation: { plumbingIssueLocId: 'wall' } }
      ]
      
      const deduplicated = deduplicateCompounds(connections)
      expect(deduplicated).toHaveLength(2)
      expect(deduplicated.map(c => c.workLocation.plumbingIssueLocId)).toEqual(['bathroom', 'kitchen'])
    })
  })

  // Simple Integration Tests
  describe('Simple Integration Tests', () => {
    test('should handle complete forward detection workflow', () => {
      const text = 'leak from ceiling'
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText(text, patterns, MINIMAL_LOOKUP)
      
      expect(connections.length).toBeGreaterThan(0)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
    })
    
    test('should handle complete reverse detection workflow', () => {
      const text = 'ceiling is leaking'
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      const connections = findReverseDirectionConnections(text, patterns, MINIMAL_LOOKUP)
      
      expect(connections.length).toBeGreaterThan(0)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
    })
    
    test('should handle compound location detection', () => {
      const text = 'water leaking from upstairs bathroom'
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText(text, patterns, MINIMAL_LOOKUP)
      
      expect(connections.length).toBeGreaterThan(0)
      // Should find compound location "upstairs bathroom"
      const compoundConnection = connections.find(c => c.workLocation.plumbingIssueLocId === 'upstairs_bathroom')
      expect(compoundConnection).toBeDefined()
      expect(compoundConnection.workLocation.alias).toBe('upstairs bathroom')
    })
  })
})
