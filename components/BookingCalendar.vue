<template>
  <div class="booking-calendar">
    <!-- Calendar Header -->
    <div class="text-center mb-4 sm:mb-6">
      <h3 class="text-lg sm:text-xl font-semibold mb-2">📅 Select Your Service Date</h3>
      <p class="text-sm sm:text-base text-gray-600">Choose when you'd like our plumbing service</p>
    </div>

    <!-- Month Navigation -->
    <div class="flex justify-between items-center mb-4 sm:mb-6">
      <button @click="previousMonth" data-nav="prev"
        class="group relative p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-x-1">
        <div class="flex items-center space-x-1 sm:space-x-2">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="hidden sm:inline font-medium text-sm">Previous</span>
        </div>
        <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>

      <h4
        class="text-lg sm:text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {{ currentMonthDisplay }}</h4>

      <button @click="nextMonth" data-nav="next"
        class="group relative p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-x-1">
        <div class="flex items-center space-x-1 sm:space-x-2">
          <span class="hidden sm:inline font-medium text-sm">Next</span>
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
        <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>
    </div>

    <!-- Calendar Grid -->
    <!-- TODO: FUTURE USE - Time slot selection in calendar grid -->
    <!-- Uncomment when implementing time slots directly in calendar -->
    <!-- :selected-date="selectedDate" -->
    <CalendarGrid 
      :calendar-days="calendarDays"
      :selected-dates="selectedDateRange"
      :resource-bookings="resourceBookings"
      :plumbers="plumbers"
      :current-month="currentMonth"
      @selected-date="handleDateSelection"
    />

    <!-- 🎨 Calendar Legend Component -->
    <CalendarLegend />
    
    <!-- 🆕 Job Type Selection -->
    <JobTypeSelector @job-type-selected="handleJobTypeSelection" />
    <!-- Selected Date Display -->
    <div v-if="selectedDateRange.length > 0"
      class="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-semibold text-blue-800 flex items-center text-sm sm:text-base">
          📅 You Selected:
        </h4>
        <button @click="clearSelection"
          class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors" title="Clear selection">
          ❌
        </button>
      </div>
      <p class="text-sm sm:text-base text-blue-700 font-medium">
        {{ formatDateRange(selectedDateRange) }}
      </p>
      <p class="text-xs sm:text-sm text-blue-600 mt-1">
        {{ selectedDateRange.length }} day{{ selectedDateRange.length > 1 ? 's' : '' }} selected
      </p>
    </div>

    <!-- 🆕 Resource Selection Section -->
    <div v-if="selectedDateRange.length > 0"
      class="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 rounded-lg border-2 border-green-200 resource-ui">
      <h4 class="font-semibold text-green-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
        👥 Available Plumbers:
      </h4>


      <!-- 🆕 Team Status Message -->
      <div v-if="selectedJobType && teamStatusMessage" class="mb-3 p-2 rounded-lg border text-sm" 
           :class="canFormRequiredTeam ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'">
        <p class="font-medium">{{ teamStatusMessage }}</p>
      </div>

      <!-- No plumbers available message -->
      <div v-if="plumbersMatchingJobRequirements.length === 0" class="text-center py-3 sm:py-4">
        <p class="text-red-600 font-medium text-sm sm:text-base">😔 No plumbers available for {{selectedJobType.name}} at this moment </p>
        <p class="text-xs sm:text-sm text-gray-600 mt-1">
          <span v-if="!selectedJobType">Select a job type first</span>
          <span v-else-if="availablePlumbers.length === 0">No plumbers available for these dates</span>
          <span v-else>Try a different job type or dates</span>
        </p>
      </div>

      <!-- Plumber list -->
      <div v-else class="space-y-2 sm:space-y-3">

        <label v-for="plumber in plumbersMatchingJobRequirements" :key="plumber.id"
          class="flex items-center p-2 sm:p-3 bg-white rounded-lg cursor-pointer hover:bg-green-100 transition-all duration-200 border-2 border-transparent hover:border-green-300">
          <input type="checkbox" :value="plumber.id" v-model="selectedPlumbers"
            class="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 text-green-600 rounded focus:ring-green-500">

          <div class="flex-1">
            <div class="flex items-center">
              <span class="text-xl sm:text-2xl mr-2">{{ plumber.avatar }}</span>
              <div>
                <span class="font-medium text-gray-800 text-sm sm:text-base">{{ plumber.displayName }}</span>
                <div class="text-xs sm:text-sm text-gray-500">
                  {{ plumber.level.charAt(0).toUpperCase() + plumber.level.slice(1) }} • ${{ plumber.rate }}/hr
                </div>
                <div class="text-xs text-gray-400 mt-1 hidden sm:block">
                  {{ plumber.specialties.join(' • ') }}
                </div>

              </div>
            </div>
          </div>

          <div class="text-right">
            <div class="text-xs sm:text-sm font-medium text-green-600" :class="plumberStatusColor(plumber)">
              {{ plumberStatusIcon(plumber) }} {{ plumberStatusText(plumber) }}
            </div>
          </div>
        </label>
      </div>

      <!-- Selected plumbers summary -->
      <div v-if="selectedPlumbers.length > 0" class="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-100 rounded-lg">
        <p class="text-xs sm:text-sm text-green-800">
          <strong>{{ selectedPlumbers.length }}</strong> plumber{{ selectedPlumbers.length > 1 ? 's' : '' }} selected
        </p>
        <p class="text-xs text-green-600 mt-1">
          Total: ${{ totalCost.toLocaleString() }} ({{ selectedDateRange.length }} days)
        </p>
      </div>
    </div>

    <!-- 🆕 Booking Actions -->
    <div v-if="selectedDateRange.length > 0" class="space-y-2 sm:space-y-3 resource-ui">
      <!-- Add to Booking Button -->
      <button @click="addBooking" :disabled="!canAddBooking"
        class="w-full py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base disabled:bg-gray-300 disabled:cursor-not-allowed">
        � Add to Booking
        <span v-if="canAddBooking" class="ml-2 text-xs sm:text-sm">
          ({{ selectedPlumbers.length }} plumber{{ selectedPlumbers.length > 1 ? 's' : '' }}, ${{ totalCost.toLocaleString() }})
        </span>
      </button>
    </div>

    <!-- 🆕 Current Bookings Summary -->
    <div v-if="currentBookings.length > 0"
      class="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200 booking-ui">
      <h4 class="font-semibold text-yellow-800 mb-2 sm:mb-3 flex items-center justify-between text-sm sm:text-base">
        <span>📋 Current Bookings : ({{ currentBookings.length }}) </span>
        <button @click="clearAllBookings" class="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium">
          Clear All
        </button>
      </h4>

      <div class="space-y-2">
        <div v-for="(booking, index) in currentBookings" :key="booking.id"
          class="p-2 sm:p-3 bg-white rounded-lg border border-yellow-200">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <p class="font-medium text-gray-800 text-sm sm:text-base">
                {{ formatDateRange(booking.dates) }}
              </p>
              <p class="text-xs sm:text-sm text-gray-600">
                {{booking.plumberDetails.map(p => p.displayName).join(', ')}}
              </p>
            </div>
            <div class="text-right ml-2">
              <p class="font-medium text-green-600 text-sm sm:text-base">${{ booking.totalCost.toLocaleString() }}</p>
              <button @click="removeBooking(booking.id)" class="text-xs text-red-600 hover:text-red-800 mt-1">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Checkout Button -->
      <button @click="proceedToCheckout"
        class="w-full mt-3 sm:mt-4 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base">
        💳 Proceed to Checkout
        <span class="ml-1 sm:ml-2 text-xs sm:text-sm">
          ({{ currentBookings.length }} booking{{ currentBookings.length > 1 ? 's' : '' }},
          ${{currentBookings.reduce((sum, b) => sum + b.totalCost, 0).toLocaleString()}})
        </span>
      </button>
    </div>

    <!-- 🆕 Recent Activity Feed -->
    <div v-if="bookingResult" class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">📋</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-gray-800 mb-1">Recent Activity</h3>
          <p class="text-sm text-gray-700 leading-relaxed">
            Booking created for {{ formatDateRange(selectedDateRange) }}
          </p>
          <p class="text-xs text-gray-500 mt-2">{{ new Date().toLocaleTimeString() }}</p>
        </div>
        <button @click="bookingResult = null" 
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          title="Dismiss">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Time slots will go here -->
    <!-- Confirmation will go here -->
  </div>
</template>

<script setup>
import { chatPromptSubmit } from '#build/ui'

// 🎯 STEP 1: Define Component Interface
// Props flow DOWN from parent to child
const props = defineProps({
  availableDates: {
    type: Array,
    default: () => [] // Array of available Date objects
  },
  bookedSlots: {
    type: Array,
    default: () => [] // Array of already booked time slots
  },
  minDate: {
    type: Date,
    default: () => new Date() // Can't book before today
  }
})

// Events flow UP from child to parent
const emit = defineEmits([
  'date-selected',      // When user picks a date
  'time-slot-selected', // When user picks a time
  'booking-confirmed',  // When user confirms booking
  'date-range-selected', // When user drags to pick a range
  // 🆕 Multi-resource booking events
  'booking-added',      // When booking is added to accumulation
  'booking-removed',    // When booking is removed from accumulation
  'all-bookings-cleared', // When all bookings are cleared
  'proceed-to-checkout' // When user wants to checkout
])

// 🎯 STEP 2: Add Reactive State
// User's selected date - starts as null (nothing selected)
const selectedDate = ref(null)

// 🆕 Recent activity state
const bookingResult = ref(null)

// User's selected time slot - starts as null  
const selectedTimeSlot = ref(null)

// Current month being displayed in calendar - starts with today's month
const currentMonth = ref(new Date())

// 🎯 URL SYNC STATE
const route = useRoute()
const router = useRouter()

// 🎯 SELECTION STATE
const selectedDateRange = ref([])
const selectedJobType = ref('') // 🆕 Track selected job type

// 🎯 Level-to-Skills Mapping (what skills each level has)
const levelSkills = {
  master: [
    'pipe_installation', 'water_heater_installation', 'emergency_repair',
    'blueprint_reading', 'drainage_maintenance', 'leak_detection',
    'gas_line_installation', 'commercial_plumbing', 'fixture_installation'
  ],
  journeyman: [
    'pipe_installation', 'water_heater_installation', 'drainage_maintenance',
    'leak_detection', 'fixture_installation', 'basic_emergency_repair'
  ],
  apprentice: [
    'basic_pipe_installation', 'fixture_installation', 'tool_assistance',
    'drainage_cleaning', 'basic_leak_detection'
  ]
}

// 🎯 Helper function to get plumber's skills based on their level
const getPlumberSkills = (plumber) => {
  return levelSkills[plumber.level] || []
}

// MULTI-RESOURCE BOOKING STATE
// Available plumbers/resources
 
const plumbers = ref([
  {
    id: 'A',
    name: 'John Smith',
    displayName: 'John (Master Plumber)',
    rate: 150,
    level: 'master',
    avatar: '👨‍🔧',
    specialties: ['Emergency', 'Repiping', 'Water Heaters'],
    
    // 🆕 Enhanced real-world data
    experience: 15, // years of experience
    license: 'Master License #PLM12345',
    certifications: ['Gas Certified', 'EPA Certified', 'Tankless Certified'],
    emergencyAvailable: true,
    totalJobs: 1247
  },
  {
    id: 'B',
    name: 'Mike Johnson',
    displayName: 'Mike (Journeyman)',
    rate: 120,
    level: 'journeyman',
    avatar: '👨‍🔧',
    specialties: ['Installations', 'Maintenance', 'Repairs'],
    
    // 🆕 Enhanced real-world data
    experience: 7, // years of experience
    license: 'Journeyman License #PLJ456',
    certifications: ['Gas Certified', 'EPA Certified'],
    emergencyAvailable: true,
    totalJobs: 892
  },
  {
    id: 'C',
    name: 'Tom Wilson',
    displayName: 'Tom (Apprentice)',
    rate: 80,
    level: 'apprentice',
    avatar: '👨‍🔧',
    specialties: ['Assistance', 'Basic Repairs', 'Learning'],
    
    // 🆕 Enhanced real-world data
    experience: 2, // years of experience
    license: 'Apprentice License #PLA789',
    certifications: ['EPA Certified'],
    emergencyAvailable: false, // Apprentices don't do emergencies
    totalJobs: 234
  }
])
const availabilityStatuses = {
  FULL: {
    text: 'All dates',
    icon: '✅',
    color: 'green'
  },
  PARTIAL: {
    text: 'Limited',
    icon: '⚠️',
    color: 'yellow'
  },
  NONE: {
    text: 'Unavailable',
    icon: '❌',
    color: 'red'
  }
}

// 📝 FUTURE ENHANCEMENT: Show unavailable plumbers for better transparency
// TODO: Consider showing ALL plumbers (available + unavailable) with their status
// Benefits:
// - Users see why certain plumbers aren't available
// - Shows demand/busy periods
// - Helps with planning around unavailable dates
// Implementation: Change v-for from "availableResources" to "resources"
// Add separate "unavailableResources" computed property

// Helper: count how many of the selected dates this plumber is actually available for
const getAvailableCountForPlumber = (plumberId) => {
  if (selectedDateRange.value.length === 0) return 0
  // Get existing bookings for this plumber
  const plumberBookings = resourceBookings.value.filter(b => b.plumberId === plumberId)
  // 🚀 OPTIMIZATION: Use Set for O(1) date lookups instead of nested some() loops
  const plumberBookedDates = new Set(
    plumberBookings.flatMap(booking => 
      booking.dates.map(date => date.toDateString())
    )
  )
  
  // Count dates where this plumber is NOT booked
  let availableCount = 0
  for (const selectedDate of selectedDateRange.value) {
    // ✅ O(1) lookup instead of O(n × m) nested loops
    const isBookedOnDate = plumberBookedDates.has(selectedDate.toDateString())
    const isAvailableOnDate = !isBookedOnDate  // Clearer: true if plumber is free
    if (isAvailableOnDate) availableCount++   // Much easier to understand!
  }
  return availableCount
}

// Derive status: FULL (all dates), PARTIAL (some dates), NONE (no dates)
const getPlumberStatus = (plumber) => {
  const totalSelected = selectedDateRange.value.length
  if (totalSelected === 0) return 'NONE'  // No dates selected = unavailable
  const availableCount = getAvailableCountForPlumber(plumber.id)
  if (availableCount === 0) return 'NONE'
  if (availableCount < totalSelected) return 'PARTIAL'
  return 'FULL'
}

const plumberStatusIcon = (plumber) => availabilityStatuses[getPlumberStatus(plumber)].icon
const plumberStatusText = (plumber) => availabilityStatuses[getPlumberStatus(plumber)].text
const plumberStatusColor = (plumber) => `text-${availabilityStatuses[getPlumberStatus(plumber)].color}-600`
// Selected resources for current booking
const selectedPlumbers = ref([])

// Accumulated bookings in current session
const currentBookings = ref([])

// Resource availability tracking (who's booked when)
const resourceBookings = ref([
  // Example: { plumberId: 'A', dates: [date1, date2], bookingId: 'booking1' }
])


// � URL SYNC: Read URL on component load
onMounted(() => {
  readUrlParams()
})

// 🎯 URL SYNC: Read URL parameters
const readUrlParams = () => {
  const { start, end } = route.query

  if (start && end) {
    // Parse dates from URL
    const startDate = new Date(start)
    const endDate = new Date(end)

    // Validate dates
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {

      selectedDateRange.value = []

      // Build date range
      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        selectedDateRange.value.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Set current month to show the selected range
      currentMonth.value = new Date(startDate)
    }
  }
}

// 🎯 STEP 3: Add Computed Properties
// These are "smart" calculations that only re-run when their data changes!

// Pretty format for selected date display
const formattedDate = computed(() => {
  if (!selectedDate.value) return 'No date selected'
  return selectedDate.value.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Available time slots for the selected date
const availableTimeSlots = computed(() => {
  // Business hours: 9AM-11AM, 1PM-4PM (skip lunch)
  const businessHours = [
    "9:00 AM", "10:00 AM", "11:00 AM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ]

  return businessHours.map(time => {
    // Check if this time slot is already booked
    const isBooked = props.bookedSlots.some(slot =>
      slot.date === selectedDate.value?.toDateString() &&
      slot.time === time
    )

    return {
      time: time,
      status: isBooked ? 'booked' : 'available'
    }
  })
})

// 🆕 MULTI-RESOURCE COMPUTED PROPERTIES
// Available resources for selected date range - show even with partial availability
const availablePlumbers = computed(() => {
  // If no dates selected, no plumbers available
  if (selectedDateRange.value.length === 0) return []

  // Show all plumbers who are available on ANY selected date
  const availablePlumbers = plumbers.value.filter(plumber => {
    // Get existing bookings for this plumber
    const plumberBookings = resourceBookings.value.filter(booking =>
      booking.plumberId === plumber.id
    )

    // 🚀 OPTIMIZATION: Use Set for O(1) date lookups instead of nested some() loops
    const plumberBookedDates = new Set(
      plumberBookings.flatMap(booking => 
        booking.dates.map(date => date.toDateString())
      )
    )
    
    // Check if plumber is available on at least one selected date
    const hasSomeAvailability = selectedDateRange.value.some(selectedDate => {
      // ✅ O(1) lookup instead of O(n × m) nested loops
      const isBookedOnDate = plumberBookedDates.has(selectedDate.toDateString())
      return !isBookedOnDate  // Available on this date
    })

    return hasSomeAvailability
  })

  return availablePlumbers
})

// 🆕 Step 1: Get plumbers who match job type requirements (levels + emergency)
const plumbersMatchingJobRequirements = computed(() => {
  // If no job type selected, show all available plumbers
  if (!selectedJobType.value) return availablePlumbers.value
  
  const jobType = selectedJobType.value
  
  return availablePlumbers.value.filter(plumber => {
    // Check if plumber has required level
    const hasRequiredLevel = !jobType.requiredLevels?.length || 
                            jobType.requiredLevels.includes(plumber.level)
    
    // Check if plumber can handle emergency (if needed)
    const canHandleEmergency = !jobType.emergencyRequired || 
                              Boolean(plumber.emergencyAvailable)
    
    // Include plumber only if both conditions pass
    return hasRequiredLevel && canHandleEmergency
  })
})

// 🆕 Step 2: Validate if enough plumbers available for required team size
const canFormRequiredTeam = computed(() => {
  // If no job type selected, no team size requirement
  if (!selectedJobType.value) return true
  
  const availableCount = plumbersMatchingJobRequirements.value.length
  const requiredTeamSize = selectedJobType.value.requiredTeamSize
  
  return availableCount >= requiredTeamSize
})

// 🆕 Step 2: Team status message for UI
const teamStatusMessage = computed(() => {
  if (!selectedJobType.value) return ''
  
  const availableCount = plumbersMatchingJobRequirements.value.length
  const requiredTeamSize = selectedJobType.value.requiredTeamSize
  
  if (availableCount >= requiredTeamSize) {
    return `✅ ${availableCount} plumbers available for team of ${requiredTeamSize}`
  } else {
    return `⚠️ Only ${availableCount} plumbers available, need ${requiredTeamSize}`
  }
})

// Selected resources details
const selectedPlumbersDetails = computed(() => {
  return selectedPlumbers.value.map(plumberId => {
    return plumbers.value.find(p => p.id === plumberId)
  }).filter(Boolean)
})

// Total cost for selected resources and dates
const totalCost = computed(() => {
  if (selectedPlumbersDetails.value.length === 0 || selectedDateRange.value.length === 0) {
    return 0
  }

  const days = selectedDateRange.value.length
  const dailyRate = selectedPlumbersDetails.value.reduce((sum, plumber) => sum + plumber.rate, 0)

  return days * dailyRate
})

// Can proceed with booking - more sophisticated for limited availability
const canAddBooking = computed(() => {
  // Basic requirements
  if (selectedDateRange.value.length === 0 || selectedPlumbers.value.length === 0) {
    return false
  }

  // Check if at least one plumber is available for at least one date
  const hasAnyAvailability = selectedPlumbers.value.some(plumberId => {
    const plumberBookings = resourceBookings.value.filter(booking =>
      booking.plumberId === plumberId
    )

    // 🚀 OPTIMIZATION: Use Set for O(1) date lookups instead of nested some() loops
    const plumberBookedDates = new Set(
      plumberBookings.flatMap(booking => 
        booking.dates.map(date => date.toDateString())
      )
    )
    
    return selectedDateRange.value.some(selectedDate => {
      // ✅ O(1) lookup instead of O(n × m) nested loops
      const isBookedOnDate = plumberBookedDates.has(selectedDate.toDateString())
      return !isBookedOnDate  // Available on this date
    })
  })

  return hasAnyAvailability
})

// Has accumulated bookings ready for checkout
const canCheckout = computed(() => {
  return currentBookings.value.length > 0
})

// 🎯 STEP 4: Add Calendar Logic
const currentMonthDisplay = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  // [to do use interestional api ]
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  // Get starting weekday (0 = Sunday)
  const startDay = firstDay.getDay()

  // Create array of calendar days
  const days = []

  // Add empty cells for days before month starts
  for (let i = 0; i < startDay; i++) {
    days.push({
      day: '',
      date: null
    })
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day: day,
      date: new Date(year, month, day)
    })
  }

  return days
})

// Calendar methods
const previousMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1)
}

const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1)
  clearSelection()
}

//  Simple date selection handler from CalendarGrid
const handleDateSelection = (dateRange) => {
  // CalendarGrid now handles all the logic and just gives us the final date range
  selectedDateRange.value = dateRange
  // Keep single-day highlight and any dependent UIs in sync
  selectedDate.value = dateRange[0] || null
  
  // Update URL if we have dates selected
  if (dateRange.length > 0) {
    const start = dateRange[0].toISOString().split('T')[0]
    const end = dateRange[dateRange.length - 1].toISOString().split('T')[0]
    
    router.push({
      query: { start, end }
    })
  }
  
  emit('date-range-selected', dateRange)
}

// 🆕 Handle job type selection from JobTypeSelector
const handleJobTypeSelection = (jobType) => {
  console.log('🎯 Job type selected in BookingCalendar:', jobType)
  selectedJobType.value = jobType
  // TODO: Later we can use this for team validation or AI suggestions
}

// Clear current selection (dates and resources)
const clearSelection = () => {
  selectedDateRange.value = []
  selectedPlumbers.value = []
  selectedDate.value = null
}

// 🆕 MULTI-RESOURCE BOOKING METHODS
// Add current selection to accumulated bookings
const addBooking = () => {
  if (!canAddBooking.value) return

  const booking = {
    id: `booking_${Date.now()}`,
    dates: [...selectedDateRange.value],
    plumbers: [...selectedPlumbers.value],
    plumberDetails: [...selectedPlumbersDetails.value],
    totalCost: totalCost.value,
    createdAt: new Date()
  }

  currentBookings.value.push(booking)

  // Update resource availability tracking - only book available dates
  selectedPlumbers.value.forEach(plumberId => {
    // Get existing bookings for this plumber
    const plumberBookings = resourceBookings.value.filter(booking =>
      booking.plumberId === plumberId
    )

    // 🚀 OPTIMIZATION: Use Set for O(1) date lookups instead of nested some() loops
    const plumberBookedDates = new Set(
      plumberBookings.flatMap(booking => 
        booking.dates.map(date => date.toDateString())
      )
    )

    // Find which dates are actually available for this plumber
    const availableDates = selectedDateRange.value.filter(selectedDate => {
      // ✅ O(1) lookup instead of O(n × m) nested loops
      const isBookedOnDate = plumberBookedDates.has(selectedDate.toDateString())
      return !isBookedOnDate  // Available if not booked
    })
    
    // 🆕 DEBUG: Log booking creation analysis
    console.log(`🔧 Creating Booking for Plumber ${plumberId}:`)
    console.log(`   📅 Requested dates:`, selectedDateRange.value.map(d => d.toDateString()))
    console.log(`   📋 Booked dates:`, Array.from(plumberBookedDates))
    console.log(`   ✅ Available dates:`, availableDates.map(d => d.toDateString()))
    console.log(`   💰 Will book ${availableDates.length} out of ${selectedDateRange.value.length} days`)
    console.log('---')

    // Only book if there are available dates
    if (availableDates.length > 0) {
      resourceBookings.value.push({
        plumberId: plumberId,
        dates: [...availableDates],  // Book only available dates
        bookingId: booking.id
      })
    }
  })

  // Clear current selection for next booking
  selectedDateRange.value = []
  selectedPlumbers.value = []
  selectedDate.value = null

  // Emit booking added event
  emit('booking-added', booking)
}

// Remove booking from accumulated bookings
const removeBooking = (bookingId) => {
  const bookingIndex = currentBookings.value.findIndex(b => b.id === bookingId)
  if (bookingIndex === -1) return

  const booking = currentBookings.value[bookingIndex]

  // Remove from resource availability tracking
  resourceBookings.value = resourceBookings.value.filter(
    rb => rb.bookingId !== bookingId
  )

  // Remove from accumulated bookings
  currentBookings.value.splice(bookingIndex, 1)

  // Emit booking removed event
  emit('booking-removed', bookingId)
}

// Clear all accumulated bookings
const clearAllBookings = () => {
  currentBookings.value = []
  resourceBookings.value = []
  emit('all-bookings-cleared')
}

// Proceed to checkout with accumulated bookings
const proceedToCheckout = () => {
  if (!canCheckout.value) return

  const checkoutData = {
    bookings: [...currentBookings.value],
    totalCost: currentBookings.value.reduce((sum, booking) => sum + booking.totalCost, 0),
    checkoutDate: new Date()
  }

  emit('proceed-to-checkout', checkoutData)
}

// Format date range for display
const formatDateRange = (dates) => {
  if (!dates || dates.length === 0) return 'No dates selected'

  const start = dates[0].toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

  const end = dates[dates.length - 1].toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  if (dates.length === 1) {
    return start
  }

  return `${start} - ${end} (${dates.length} days)`
}

// 🎯 STEP 4: Build Template (Next)
// 🎯 STEP 5: Add Methods (Next)
</script>

