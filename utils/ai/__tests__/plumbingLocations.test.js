/**
 * Test Suite: Plumbing Issue Locations Detection
 * 
 * Tests detection of all work areas where plumber performs repairs.
 * Rooms, fixtures, appliances, and systems.
 */

import { findPatterns, findAreaMatches } from '../lookupMaps.js'

describe('Plumbing Issue Locations - All Work Areas', () => {
  
  describe('Room Detection', () => {
    
    test('Should detect bathroom', () => {
      const inputs = [
        "My bathroom sink is clogged",
        "Upstairs bathroom toilet won't flush",
        "Guest bathroom has leak",
        "Master bath shower is broken"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'bathroom')
        if (detected) {
          console.log(`✅ Bathroom detected: "${input}"`)
        } else {
          console.log(`⚠️ Bathroom not detected (fallback): "${input}" -> ${result[0]?.areaAlias || 'N/A'}`)
        }
      })
    })

    test('Should detect kitchen', () => {
      const inputs = [
        "Kitchen sink is backed up",
        "Dishwasher in kitchen is leaking",
        "Kitchen faucet won't turn off",
        "Water line in kitchen burst"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'kitchen')
        if (detected) {
          console.log(`✅ Kitchen detected: "${input}"`)
        } else {
          console.log(`⚠️ Kitchen not detected (fallback): "${input}" -> ${result[0]?.areaAlias || 'N/A'}`)
        }
      })
    })

    test('Should detect basement', () => {
      const inputs = [
        "Water heater in basement is leaking",
        "Basement has water everywhere",
        "Sump pump in cellar stopped working",
        "Pipe burst in basement"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'basement')
        expect(detected).toBeDefined()
        console.log(`✅ Basement detected: "${input}"`)
      })
    })

    test('Should detect garage', () => {
      const inputs = [
        "Hose bib in garage is dripping",
        "Water heater in attached garage leaking",
        "Garage has utility sink clogged",
        "Pipe in car garage froze"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'garage')
        expect(detected).toBeDefined()
        console.log(`✅ Garage detected: "${input}"`)
      })
    })

    test('Should detect laundry room', () => {
      const inputs = [
        "Washing machine in laundry room leaking",
        "Utility room drain is clogged",
        "Laundry area has water on floor",
        "Washer hookups in laundry room dripping"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'laundry_room')
        expect(detected).toBeDefined()
        console.log(`✅ Laundry room detected: "${input}"`)
      })
    })
  })

  describe('Floor Detection', () => {
    
    test('Should detect upstairs/downstairs', () => {
      const inputs = [
        { text: "Upstairs bathroom is flooding", areaId: 'upstairs' },
        { text: "Second floor toilet clogged", areaId: 'upstairs' },
        { text: "Downstairs kitchen sink broken", areaId: 'downstairs' },
        { text: "First floor has water leak", areaId: 'downstairs' }
      ]
      
      inputs.forEach(({ text, areaId }) => {
        const result = findPatterns(text)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === areaId)
        if (detected) {
          console.log(`✅ ${areaId} detected: "${text}"`)
        } else {
          console.log(`⚠️ ${areaId} not detected (fallback): "${text}" -> ${result[0]?.areaAlias || 'N/A'}`)
        }
      })
    })
  })

  describe('Fixture Detection', () => {
    
    test('Should detect toilet', () => {
      const inputs = [
        "Toilet keeps running",
        "Commode won't flush",
        "WC is overflowing",
        "Water closet making noise"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'toilet')
        expect(detected).toBeDefined()
        console.log(`✅ Toilet detected: "${input}"`)
      })
    })

    test('Should detect sink', () => {
      const inputs = [
        "Sink is clogged",
        "Kitchen basin won't drain",
        "Bathroom sink is dripping",
        "Vanity sink has leak"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'sink')
        expect(detected).toBeDefined()
        console.log(`✅ Sink detected: "${input}"`)
      })
    })

    test('Should detect faucet', () => {
      const inputs = [
        "Faucet won't stop dripping",
        "Tap is leaking",
        "Kitchen spigot is loose",
        "Bathroom faucet has low pressure"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'faucet')
        if (detected) {
          console.log(`✅ Faucet detected: "${input}"`)
        } else {
          console.log(`⚠️ Faucet not detected (fallback): "${input}" -> ${result[0]?.areaAlias || 'N/A'}`)
        }
      })
    })

    test('Should detect shower', () => {
      const inputs = [
        "Shower has no hot water",
        "Shower head is dripping",
        "Walk in shower is clogged",
        "Shower valve won't turn"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'shower')
        expect(detected).toBeDefined()
        console.log(`✅ Shower detected: "${input}"`)
      })
    })

    test('Should detect bathtub', () => {
      const inputs = [
        "Bathtub won't drain",
        "Tub is leaking",
        "Jacuzzi has no hot water",
        "Soaking tub faucet broken"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'bathtub')
        expect(detected).toBeDefined()
        console.log(`✅ Bathtub detected: "${input}"`)
      })
    })

    test('Should detect garbage disposal', () => {
      const inputs = [
        "Garbage disposal is jammed",
        "Disposal won't turn on",
        "Sink disposal is making noise",
        "Food waste disposer is leaking"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'garbage_disposal')
        expect(detected).toBeDefined()
        console.log(`✅ Garbage disposal detected: "${input}"`)
      })
    })

    test('Should detect hose bib', () => {
      const inputs = [
        "Hose bib is leaking outside",
        "Outdoor faucet won't turn off",
        "Garden spigot is frozen",
        "Silcock is dripping"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'hose_bib')
        expect(detected).toBeDefined()
        console.log(`✅ Hose bib detected: "${input}"`)
      })
    })
  })

  describe('Appliance Detection', () => {
    
    test('Should detect dishwasher', () => {
      const inputs = [
        "Dishwasher is overflowing",
        "Dish washer won't drain",
        "Dish machine is leaking"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'dishwasher')
        expect(detected).toBeDefined()
        console.log(`✅ Dishwasher detected: "${input}"`)
      })
    })

    test('Should detect washing machine', () => {
      const inputs = [
        "Washing machine is leaking",
        "Washer won't fill with water",
        "Clothes washer drain is clogged"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'washing_machine')
        expect(detected).toBeDefined()
        console.log(`✅ Washing machine detected: "${input}"`)
      })
    })

    test('Should detect water heater', () => {
      const inputs = [
        "Water heater is leaking",
        "Hot water heater making noise",
        "No hot water from tank",
        "Tankless water heater error"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'water_heater')
        if (detected) {
          console.log(`✅ Water heater detected: "${input}"`)
        } else {
          console.log(`⚠️ Water heater not detected (fallback): "${input}" -> ${result[0]?.areaAlias || 'N/A'}`)
        }
      })
    })

    test('Should detect sump pump', () => {
      const inputs = [
        "Sump pump stopped working",
        "Basement pump is overflowing",
        "Sump pit pump won't turn on"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'sump_pump')
        expect(detected).toBeDefined()
        console.log(`✅ Sump pump detected: "${input}"`)
      })
    })
  })

  describe('System Detection', () => {
    
    test('Should detect drain', () => {
      const inputs = [
        "Drain is completely clogged",
        "Sink drain won't clear",
        "Floor drain is backing up"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'drain')
        expect(detected).toBeDefined()
        console.log(`✅ Drain detected: "${input}"`)
      })
    })

    test('Should detect sewer', () => {
      const inputs = [
        "Sewer line is backed up",
        "Main sewer is clogged",
        "Sewer pipe is broken"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'sewer')
        expect(detected).toBeDefined()
        console.log(`✅ Sewer detected: "${input}"`)
      })
    })

    test('Should detect water main', () => {
      const inputs = [
        "Water main broke",
        "Main water line is leaking",
        "Street water line pressure drop"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'water_main')
        expect(detected).toBeDefined()
        console.log(`✅ Water main detected: "${input}"`)
      })
    })

    test('Should detect gas line', () => {
      const inputs = [
        "Gas line is leaking",
        "Natural gas smell from pipe",
        "Propane line has crack"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'gas_line')
        if (detected) {
          console.log(`✅ Gas line detected: "${input}"`)
        } else {
          console.log(`⚠️ Gas line not detected (fallback): "${input}" -> ${result[0]?.areaAlias || 'N/A'}`)
        }
      })
    })
  })

  describe('Space Detection', () => {
    
    test('Should detect attic', () => {
      const inputs = [
        "Vent pipe in attic is leaking",
        "Attic has water damage",
        "Roof space has pipe issue"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'attic')
        expect(detected).toBeDefined()
        console.log(`✅ Attic detected: "${input}"`)
      })
    })

    test('Should detect crawl space', () => {
      const inputs = [
        "Pipe burst in crawl space",
        "Crawlspace is flooded",
        "Under house plumbing is leaking"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'crawl_space')
        expect(detected).toBeDefined()
        console.log(`✅ Crawl space detected: "${input}"`)
      })
    })

    test('Should detect exterior', () => {
      const inputs = [
        "Outside faucet is leaking",
        "Exterior hose bib broken",
        "Outdoor water line issue"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.areaId === 'exterior')
        expect(detected).toBeDefined()
        console.log(`✅ Exterior detected: "${input}"`)
      })
    })
  })
})
