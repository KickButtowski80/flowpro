// Job types with variants for plumbing services
export const JOB_TYPES = [
  {
    id: 'emergency_repair',
    name: 'Emergency Repair',
    description: 'Urgent plumbing issues that need immediate attention',
    complexities: [
      {
        id: 'minor',
        name: 'Minor Emergency',
        description: 'Single leaky pipe, clogged drain',
        requiredTeamSize: 1,
        requiredLevels: ['journeyman'],
        emergencyRequired: true,
        estimatedDuration: '1-2 hours',
        basePrice: 150,
        icon: '🚨'
      },
      {
        id: 'major',
        name: 'Major Emergency',
        description: 'Multiple pipe bursts, major leaks',
        requiredTeamSize: 2,
        requiredLevels: ['master', 'journeyman'],
        emergencyRequired: true,
        estimatedDuration: '2-4 hours',
        basePrice: 200,
        icon: '🚨'
      },
      {
        id: 'critical',
        name: 'Critical Emergency',
        description: 'Main line failure, flooding, gas leaks',
        requiredTeamSize: 3,
        requiredLevels: ['master', 'master', 'journeyman'],
        emergencyRequired: true,
        estimatedDuration: '4-6 hours',
        basePrice: 350,
        icon: '🚨'
      }
    ]
  },
  {
    id: 'water_heater_installation',
    name: 'Water Heater Installation',
    description: 'Install or replace water heater units',
    sizes: [
      {
        id: 'small',
        name: 'Small Unit (40gal)',
        description: 'Apartment, small home',
        requiredTeamSize: 1,
        requiredLevels: ['journeyman'],
        emergencyRequired: false,
        estimatedDuration: '2-3 hours',
        basePrice: 200,
        icon: '🔥'
      },
      {
        id: 'standard',
        name: 'Standard Unit (50gal)',
        description: 'Average family home',
        requiredTeamSize: 2,
        requiredLevels: ['journeyman', 'apprentice'],
        emergencyRequired: false,
        estimatedDuration: '4-6 hours',
        basePrice: 250,
        icon: '🔥'
      },
      {
        id: 'large',
        name: 'Large Unit (80gal+)',
        description: 'Large home, high demand',
        requiredTeamSize: 3,
        requiredLevels: ['master', 'journeyman', 'apprentice'],
        emergencyRequired: false,
        estimatedDuration: '6-8 hours',
        basePrice: 400,
        icon: '🔥'
      }
    ]
  },
  {
    id: 'repiping_project',
    name: 'Repiping Project',
    description: 'Complete pipe replacement for home or business',
    scopes: [
      {
        id: 'small',
        name: 'Small Home',
        description: '1-2 bedroom house, apartment',
        requiredTeamSize: 2,
        requiredLevels: ['journeyman', 'apprentice'],
        emergencyRequired: false,
        estimatedDuration: '2-4 days',
        basePrice: 300,
        icon: '🔧'
      },
      {
        id: 'medium',
        name: 'Medium Home',
        description: '3-4 bedroom house',
        requiredTeamSize: 3,
        requiredLevels: ['master', 'journeyman', 'apprentice'],
        emergencyRequired: false,
        estimatedDuration: '4-6 days',
        basePrice: 500,
        icon: '🔧'
      },
      {
        id: 'large',
        name: 'Large/Commercial',
        description: '5+ bedroom, commercial building',
        requiredTeamSize: 4,
        requiredLevels: ['master', 'master', 'journeyman', 'apprentice'],
        emergencyRequired: false,
        estimatedDuration: '1-2 weeks',
        basePrice: 800,
        icon: '🔧'
      }
    ]
  },
  {
    id: 'routine_maintenance',
    name: 'Routine Maintenance',
    description: 'Regular plumbing maintenance and inspections',
    propertyTypes: [
      {
        id: 'small',
        name: 'Small Property',
        description: 'Studio, 1-bedroom apartment',
        requiredTeamSize: 1,
        requiredLevels: ['apprentice'],
        emergencyRequired: false,
        estimatedDuration: '1 hour',
        basePrice: 75,
        icon: '🔩'
      },
      {
        id: 'medium',
        name: 'Medium Home',
        description: '2-3 bedroom house',
        requiredTeamSize: 1,
        requiredLevels: ['apprentice', 'journeyman'],
        emergencyRequired: false,
        estimatedDuration: '1-2 hours',
        basePrice: 100,
        icon: '🔩'
      },
      {
        id: 'large',
        name: 'Large Property',
        description: '4+ bedroom house, multi-unit',
        requiredTeamSize: 2,
        requiredLevels: ['journeyman', 'apprentice'],
        emergencyRequired: false,
        estimatedDuration: '2-3 hours',
        basePrice: 150,
        icon: '🔩'
      }
    ]
  }
]
