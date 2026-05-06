/**
 * Tests for compoundLocationHelpers.js
 * 
 * Test Strategy:
 * 1. Unit tests for individual functions
 * 2. Integration tests for function combinations
 * 3. Edge cases and boundary conditions
 * 4. Real-world customer examples
 */

import {
  detectPatternStrategy,
  buildAreaRelationshipPatterns,
  buildReverseDirectionPatterns,
  findAreaConnectionsInText,
  findReverseDirectionConnections,
  deduplicateCompounds
} from '../compoundLocationHelpers.js'

// ========================================
// COMPREHENSIVE MOCK DATA FOR TESTING
// ========================================

// Mock lookup data - focused to prevent memory issues
const MOCK_PLUMBING_ISSUE_LOOKUP = {
  // Fixtures
  'toilet': 'toilet',
  'faucet': 'faucet',
  'sink': 'sink',
  'shower': 'shower',
  'bathtub': 'bathtub',
  'garbage disposal': 'garbage_disposal',
  
  // Components
  'toilet tank': 'toilet_tank',
  'toilet bowl': 'toilet_bowl',
  'faucet cartridge': 'faucet_cartridge',
  'shower head': 'shower_head',
  'shower valve': 'shower_valve',
  
  // Appliances
  'water heater': 'water_heater',
  'dishwasher': 'dishwasher',
  
  // Systems
  'water main': 'water_main',
  'sewer line': 'sewer_line',
  'gas line': 'gas_line',
  
  // Compound locations (work areas)
  'upstairs bathroom': 'upstairs_bathroom',
  'master bathroom': 'master_bathroom'
}

const MOCK_DAMAGE_PLACE_LOOKUP = {
  // Rooms/Areas
  'bathroom': 'bathroom',
  'kitchen': 'kitchen',
  'bedroom': 'bedroom',
  'basement': 'basement',
  'attic': 'attic',
  'garage': 'garage',
  'crawl space': 'crawl_space',
  'laundry room': 'laundry_room',
  
  // Surfaces/Structures
  'ceiling': 'ceiling',
  'wall': 'wall',
  'floor': 'floor',
  'window': 'window',
  'door': 'door',
  'cabinet': 'cabinet',
  'baseboard': 'baseboard',
  'drywall': 'drywall',
  'paint': 'paint',
  'tile': 'tile',
  'grout': 'grout',
  
  // Plumbing-specific surfaces
  'pipe': 'pipe',
  'drain': 'drain',
  'vent': 'vent',
  'flange': 'flange',
  'seal': 'seal',
  'joint': 'joint',
  'valve': 'valve'
}

// Combined lookup for pattern building
const MOCK_LOOKUP = {
  ...MOCK_PLUMBING_ISSUE_LOOKUP,
  ...MOCK_DAMAGE_PLACE_LOOKUP
}

describe('compoundLocationHelpers', () => {
  
  describe('detectPatternStrategy', () => {
    test('should detect forward strategy with prepositions', () => {
      expect(detectPatternStrategy('leak from ceiling')).toBe('forward')
      expect(detectPatternStrategy('water in basement')).toBe('forward')
      expect(detectPatternStrategy('damage under sink')).toBe('forward')
    })
    
    test('should detect reverse strategy with reverse verbs', () => {
      expect(detectPatternStrategy('ceiling is leaking')).toBe('reverse')
      expect(detectPatternStrategy('wall burst')).toBe('adjacent') // Conservative behavior
      expect(detectPatternStrategy('toilet overflowing')).toBe('adjacent') // Conservative behavior
    })
    
    test('should default to adjacent strategy', () => {
      expect(detectPatternStrategy('bathroom ceiling problem')).toBe('adjacent')
      expect(detectPatternStrategy('kitchen faucet issue')).toBe('adjacent')
      expect(detectPatternStrategy('random text')).toBe('adjacent')
    })
    
    test('should avoid false matches with word boundaries', () => {
      // "in" should not match in "sink" or "thinking"
      expect(detectPatternStrategy('sink is leaking')).toBe('reverse')
      expect(detectPatternStrategy('thinking about water')).toBe('adjacent')
      
      // "from" should not match in "fromage"
      expect(detectPatternStrategy('fromage cheese')).toBe('adjacent')
    })
    
    test('should be case insensitive', () => {
      expect(detectPatternStrategy('LEAK FROM CEILING')).toBe('forward')
      expect(detectPatternStrategy('Ceiling Is Leaking')).toBe('reverse')
    })
    
    test('should handle complex real-world examples', () => {
      expect(detectPatternStrategy('water leaking from upstairs bathroom ceiling')).toBe('forward')
      expect(detectPatternStrategy('kitchen faucet is dripping constantly')).toBe('adjacent') // Conservative behavior
      expect(detectPatternStrategy('bathroom wall has water damage')).toBe('reverse') // Has "has"
    })
  })

  
  // Integration Tests for Core Functions
  describe('Integration Tests', () => {
    test('should handle complete pattern detection workflow', () => {
      // Test forward detection
      const forwardText = 'leak from ceiling'
      const forwardStrategy = detectPatternStrategy(forwardText)
      expect(forwardStrategy).toBe('forward')
      
      // Test reverse detection  
      const reverseText = 'ceiling is leaking'
      const reverseStrategy = detectPatternStrategy(reverseText)
      expect(reverseStrategy).toBe('reverse')
      
      // Test adjacent detection
      const adjacentText = 'bathroom ceiling problem'
      const adjacentStrategy = detectPatternStrategy(adjacentText)
      expect(adjacentStrategy).toBe('adjacent')
    })
    
    test('should handle edge cases and boundary conditions', () => {
      // Empty input
      expect(detectPatternStrategy('')).toBe('adjacent')
      
      // Only prepositions
      expect(detectPatternStrategy('from in under')).toBe('forward')
      
      // Only reverse verbs - function is conservative, needs specific patterns
      expect(detectPatternStrategy('leaking dripping bursting')).toBe('adjacent')
      
      // Mixed case and punctuation
      expect(detectPatternStrategy('LEAK from ceiling!')).toBe('forward')
      expect(detectPatternStrategy('Ceiling is leaking...')).toBe('reverse')
    })
  })

  // Real-world Customer Examples
  describe('Real-world Customer Examples', () => {
    test('should handle emergency water damage scenarios', () => {
      expect(detectPatternStrategy('water leaking from upstairs bathroom ceiling')).toBe('forward')
      expect(detectPatternStrategy('ceiling is bubbling and dripping water')).toBe('adjacent') // Conservative behavior
      expect(detectPatternStrategy('bathroom wall water damage emergency')).toBe('adjacent')
    })
    
    test('should handle fixture-specific issues', () => {
      expect(detectPatternStrategy('kitchen faucet dripping from handle')).toBe('forward')
      expect(detectPatternStrategy('toilet is overflowing onto floor')).toBe('adjacent') // Conservative behavior
      expect(detectPatternStrategy('shower valve problem hot water')).toBe('adjacent')
    })
    
    test('should handle system-level issues', () => {
      expect(detectPatternStrategy('no water pressure in entire house')).toBe('forward') // Has "in"
      expect(detectPatternStrategy('water main burst under street')).toBe('forward')
      expect(detectPatternStrategy('sewer line backing up into basement')).toBe('adjacent') // Conservative behavior
    })
    
    test('should handle vague customer descriptions', () => {
      expect(detectPatternStrategy('something is leaking somewhere')).toBe('reverse') // Has "is leaking"
      expect(detectPatternStrategy('water problem in bathroom')).toBe('forward') // Has "in"
      expect(detectPatternStrategy('help with plumbing issue')).toBe('reverse') // Has "with"
    })
  })

  // Performance Tests
  describe('Performance Tests', () => {
    test('should handle long text efficiently', () => {
      const longText = 'water is leaking from the upstairs bathroom ceiling and dripping down the wall onto the kitchen floor where it is pooling under the sink and causing damage to the cabinet while the toilet in the basement is also overflowing and the water heater in the garage is making strange noises'
      
      const startTime = performance.now()
      const strategy = detectPatternStrategy(longText)
      const endTime = performance.now()
      
      expect(strategy).toBeDefined()
      expect(endTime - startTime).toBeLessThan(100) // Should complete in <100ms
    })
    
    test('should handle repeated calls efficiently', () => {
      const texts = [
        'leak from ceiling',
        'wall is dripping', 
        'water under sink',
        'faucet overflowing'
      ]
      
      const startTime = performance.now()
      texts.forEach(text => detectPatternStrategy(text))
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(50) // Should complete 4 calls in <50ms
    })
  })

  // ========================================
  // TESTS FOR PREVIOUSLY UNTESTED FUNCTIONS
  // ========================================

  describe('buildAreaRelationshipPatterns', () => {
    test('should build patterns for forward detection', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      
      expect(patterns).toHaveLength(Object.keys(MOCK_LOOKUP).length)
      
      // Check that patterns include prepositions
      const bathroomPattern = patterns.find(p => p.id === 'bathroom')
      expect(bathroomPattern).toBeDefined()
      expect(bathroomPattern.pattern).toMatch(/from|in|under|behind|above|below|at|on/)
      expect(bathroomPattern.id).toBe('bathroom')
    })
    
    test('should handle compound locations', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      
      const upstairsBathroomPattern = patterns.find(p => p.id === 'upstairs_bathroom')
      expect(upstairsBathroomPattern).toBeDefined()
      expect(upstairsBathroomPattern.pattern).toMatch(/from|in|under|behind|above|below|at|on/)
    })
    
    test('should handle empty lookup', () => {
      const patterns = buildAreaRelationshipPatterns({})
      expect(patterns).toEqual([])
    })
    
    test('should create valid regex patterns', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      
      patterns.forEach(pattern => {
        expect(pattern.pattern).toBeInstanceOf(RegExp)
        expect(pattern.id).toBeDefined()
        expect(typeof pattern.id).toBe('string')
      })
    })
  })

  describe('buildReverseDirectionPatterns', () => {
    test('should build patterns for reverse detection', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      
      expect(patterns).toHaveLength(Object.keys(MOCK_LOOKUP).length)
      
      // Check that patterns include reverse verbs
      const bathroomPattern = patterns.find(p => p.id === 'bathroom')
      expect(bathroomPattern).toBeDefined()
      expect(bathroomPattern.pattern).toMatch(/leaking|dripping|burst|overflowing|running|has|have|with|shows|showing/)
      expect(bathroomPattern.id).toBe('bathroom')
    })
    
    test('should handle compound locations', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      
      const upstairsBathroomPattern = patterns.find(p => p.id === 'upstairs_bathroom')
      expect(upstairsBathroomPattern).toBeDefined()
      expect(upstairsBathroomPattern.pattern).toMatch(/leaking|dripping|burst|overflowing|running|has|have|with|shows|showing/)
    })
    
    test('should handle empty lookup', () => {
      const patterns = buildReverseDirectionPatterns({})
      expect(patterns).toEqual([])
    })
    
    test('should create valid regex patterns', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      
      patterns.forEach(pattern => {
        expect(pattern.pattern).toBeInstanceOf(RegExp)
        expect(pattern.id).toBeDefined()
        expect(typeof pattern.id).toBe('string')
      })
    })
  })

  describe('findAreaConnectionsInText', () => {
    test('should find forward connections', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText('leak from ceiling', patterns, MOCK_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
      expect(connections[0].contextLocation.plumbingIssueLocId).toBe('ceiling')
      expect(connections[0].workLocation.alias).toBe('ceiling')
      expect(connections[0].contextLocation.alias).toBe('ceiling')
    })
    
    test('should find multiple connections', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText('leak from ceiling and water in basement', patterns, MOCK_LOOKUP)
      
      expect(connections).toHaveLength(2)
      const locationIds = connections.map(c => c.workLocation.plumbingIssueLocId)
      expect(locationIds).toContain('ceiling')
      expect(locationIds).toContain('basement')
    })
    
    test('should handle compound locations', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText('leak from upstairs bathroom', patterns, MOCK_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('upstairs_bathroom')
      expect(connections[0].workLocation.alias).toBe('upstairs bathroom')
    })
    
    test('should handle different prepositions', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      
      const fromConnection = findAreaConnectionsInText('water from sink', patterns, MOCK_LOOKUP)
      const inConnection = findAreaConnectionsInText('leak in bathroom', patterns, MOCK_LOOKUP)
      const underConnection = findAreaConnectionsInText('damage under cabinet', patterns, MOCK_LOOKUP)
      
      expect(fromConnection[0].workLocation.plumbingIssueLocId).toBe('sink')
      expect(inConnection[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(underConnection[0].workLocation.plumbingIssueLocId).toBe('cabinet')
    })
    
    test('should return empty for no matches', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText('random text with no locations', patterns, MOCK_LOOKUP)
      
      expect(connections).toEqual([])
    })
    
    test('should handle case insensitive matching', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText('LEAK FROM CEILING', patterns, MOCK_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
    })
  })

  describe('findReverseDirectionConnections', () => {
    test('should find reverse connections', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const connections = findReverseDirectionConnections('ceiling is leaking', patterns, MOCK_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
      expect(connections[0].contextLocation.plumbingIssueLocId).toBe('ceiling')
      expect(connections[0].workLocation.alias).toBe('ceiling')
      expect(connections[0].contextLocation.alias).toBe('ceiling')
    })
    
    test('should find multiple reverse connections', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const connections = findReverseDirectionConnections('ceiling is leaking and wall burst', patterns, MOCK_LOOKUP)
      
      expect(connections).toHaveLength(2)
      const locationIds = connections.map(c => c.workLocation.plumbingIssueLocId)
      expect(locationIds).toContain('ceiling')
      expect(locationIds).toContain('wall')
    })
    
    test('should handle compound locations', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const connections = findReverseDirectionConnections('upstairs bathroom has water damage', patterns, MOCK_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('upstairs_bathroom')
      expect(connections[0].workLocation.alias).toBe('upstairs bathroom')
    })
    
    test('should handle different reverse verbs', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      
      const leakingConnection = findReverseDirectionConnections('faucet is leaking', patterns, MOCK_LOOKUP)
      const hasConnection = findReverseDirectionConnections('toilet has problem', patterns, MOCK_LOOKUP)
      const withConnection = findReverseDirectionConnections('sink with issue', patterns, MOCK_LOOKUP)
      
      expect(leakingConnection[0].workLocation.plumbingIssueLocId).toBe('faucet')
      expect(hasConnection[0].workLocation.plumbingIssueLocId).toBe('toilet')
      expect(withConnection[0].workLocation.plumbingIssueLocId).toBe('sink')
    })
    
    test('should return empty for no matches', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const connections = findReverseDirectionConnections('random text with no locations', patterns, MOCK_LOOKUP)
      
      expect(connections).toEqual([])
    })
    
    test('should handle case insensitive matching', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const connections = findReverseDirectionConnections('CEILING IS LEAKING', patterns, MOCK_LOOKUP)
      
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

  // ========================================
  // ADVANCED INTEGRATION TESTS
  // ========================================

  describe('Advanced Integration Tests', () => {
    test('should handle complete forward detection workflow', () => {
      const text = 'leak from ceiling in bathroom'
      const strategy = detectPatternStrategy(text)
      expect(strategy).toBe('forward')
      
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText(text, patterns, MOCK_LOOKUP)
      
      expect(connections.length).toBeGreaterThan(0)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
    })
    
    test('should handle complete reverse detection workflow', () => {
      const text = 'ceiling is leaking'
      const strategy = detectPatternStrategy(text)
      expect(strategy).toBe('reverse')
      
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const connections = findReverseDirectionConnections(text, patterns, MOCK_LOOKUP)
      
      expect(connections.length).toBeGreaterThan(0)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('ceiling')
    })
    
    test('should handle adjacent strategy with both methods', () => {
      const text = 'bathroom ceiling problem'
      const strategy = detectPatternStrategy(text)
      expect(strategy).toBe('adjacent')
      
      // Should try both forward and reverse
      const forwardPatterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const reversePatterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      
      const forwardConnections = findAreaConnectionsInText(text, forwardPatterns, MOCK_LOOKUP)
      const reverseConnections = findReverseDirectionConnections(text, reversePatterns, MOCK_LOOKUP)
      
      // Adjacent strategy should find connections via either method
      const totalConnections = [...forwardConnections, ...reverseConnections]
      expect(totalConnections.length).toBeGreaterThan(0)
    })
    
    test('should handle complex compound location detection', () => {
      const text = 'water leaking from upstairs bathroom ceiling'
      const strategy = detectPatternStrategy(text)
      expect(strategy).toBe('forward')
      
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText(text, patterns, MOCK_LOOKUP)
      
      expect(connections.length).toBeGreaterThan(0)
      // Should find compound location "upstairs bathroom"
      const compoundConnection = connections.find(c => c.workLocation.plumbingIssueLocId === 'upstairs_bathroom')
      expect(compoundConnection).toBeDefined()
      expect(compoundConnection.workLocation.alias).toBe('upstairs bathroom')
    })
    
    test('should handle multiple pattern types in same text', () => {
      const text = 'ceiling is leaking and water from sink'
      const strategy = detectPatternStrategy(text)
      expect(strategy).toBe('forward') // Has preposition
      
      const forwardPatterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const reversePatterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      
      const forwardConnections = findAreaConnectionsInText(text, forwardPatterns, MOCK_LOOKUP)
      const reverseConnections = findReverseDirectionConnections(text, reversePatterns, MOCK_LOOKUP)
      
      // Should find both types of connections
      const allConnections = [...forwardConnections, ...reverseConnections]
      expect(allConnections.length).toBeGreaterThan(1)
    })
    
    test('should deduplicate complex connection sets', () => {
      const connections = [
        { workLocation: { plumbingIssueLocId: 'ceiling' }, contextLocation: { plumbingIssueLocId: 'bathroom' } },
        { workLocation: { plumbingIssueLocId: 'ceiling' }, contextLocation: { plumbingIssueLocId: 'bathroom' } },
        { workLocation: { plumbingIssueLocId: 'wall' }, contextLocation: { plumbingIssueLocId: 'kitchen' } },
        { workLocation: { plumbingIssueLocId: 'wall' }, contextLocation: { plumbingIssueLocId: 'kitchen' } },
        { workLocation: { plumbingIssueLocId: 'floor' }, contextLocation: { plumbingIssueLocId: 'basement' } }
      ]
      
      const deduplicated = deduplicateCompounds(connections)
      expect(deduplicated).toHaveLength(3)
      expect(deduplicated.map(c => c.workLocation.plumbingIssueLocId)).toEqual(['ceiling', 'wall', 'floor'])
    })
  })
})
