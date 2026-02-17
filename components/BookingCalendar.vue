<template>
  <div class="booking-calendar">
    <!-- Calendar Header -->
    <div class="text-center mb-4 sm:mb-6">
      <h3 class="text-lg sm:text-xl font-semibold mb-2">📅 Select Your Service Date</h3>
      <p class="text-sm sm:text-base text-gray-600">Choose when you'd like our plumbing service</p>
    </div>

    <!-- Month Navigation -->
    <div class="flex justify-between items-center mb-4 sm:mb-6">
      <button @click="previousMonth" 
              data-nav="prev"
              class="group relative p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-x-1">
        <div class="flex items-center space-x-1 sm:space-x-2">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="hidden sm:inline font-medium text-sm">Previous</span>
        </div>
        <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>
      
      <h4 class="text-lg sm:text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{{ currentMonthDisplay }}</h4>
      
      <button @click="nextMonth" 
              data-nav="next"
              class="group relative p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-x-1">
        <div class="flex items-center space-x-1 sm:space-x-2">
          <span class="hidden sm:inline font-medium text-sm">Next</span>
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
        <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-6 select-none touch-none"
         @mousedown="startDrag"
         @mousemove="updateDrag"
         @mouseup="endDrag"
         @mouseleave="endDrag"
         @touchstart="startDrag"
         @touchmove="updateDrag"
         @touchend="endDrag"
         @touchcancel="endDrag">
      <!-- Weekday headers -->
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Sun</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Mon</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Tue</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Wed</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Thu</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Fri</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Sat</div>
      
      <!-- Calendar days will go here -->
      <div v-for="day in calendarDays" :key="day.date" 
           class="text-center p-3 sm:p-2 min-h-[44px] sm:min-h-0 
           text-sm sm:text-base border rounded cursor-pointer 
           hover:bg-blue-50 active:bg-blue-100 transition-colors"
           :data-date="day.date ? day.date.toISOString() : ''"
           :class="{
             'bg-blue-100': isSelected(day.date),
             'text-gray-400': !isCurrentMonth(day.date),
             'bg-green-100': isAvailable(day.date),
             'bg-purple-200': isInDragRange(day.date)
           }"
           @click="selectDate(day.date)">
        {{ day.day }}
      </div>
    </div>

    <!-- Selected Date Display -->
    <div v-if="selectedDateRange.length > 0" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-semibold text-blue-800 flex items-center text-sm sm:text-base">
          📅 You Selected:
        </h4>
        <button @click="clearSelection" 
                class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                title="Clear selection">
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
    <div v-if="selectedDateRange.length > 0" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 rounded-lg border-2 border-green-200 resource-ui">
      <h4 class="font-semibold text-green-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
        👥 Available Plumbers:
      </h4>
      
      <!-- Availability notice -->
      <div class="text-xs sm:text-sm text-blue-600 mb-3 p-2 bg-blue-50 rounded border border-blue-200">
        ℹ️ <strong>All-or-Nothing Availability:</strong> Plumbers shown here are available for ALL selected dates
      </div>
      
      <!-- No Plumbers Available Dialog -->
      <dialog 
        v-if="availableResources.length === 0" 
        ref="noPlumbersDialog"
        class="p-0 rounded-2xl shadow-2xl backdrop:bg-black/50 border-0 max-w-md w-full
               fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
               max-h-[90vh] overflow-y-auto">
        
        <!-- Dialog Header -->
        <div class="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 sm:p-6 rounded-t-2xl text-center">
          <div class="text-3xl sm:text-4xl mb-2">😔</div>
          <h3 class="text-lg sm:text-xl font-bold text-white mb-1">No Plumbers Available</h3>
          <p class="text-yellow-100 text-xs sm:text-sm">Availability Conflict Detected</p>
        </div>
        
        <!-- Dialog Body -->
        <div class="p-4 sm:p-6 bg-white">
          <div class="space-y-3 sm:space-y-4">
            <!-- Problem Explanation -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <div class="flex items-start space-x-2 sm:space-x-3">
                <span class="text-yellow-600 text-lg sm:text-xl">⚠️</span>
                <div>
                  <h4 class="font-semibold text-yellow-800 mb-1 text-sm sm:text-base">What's Happening?</h4>
                  <p class="text-xs sm:text-sm text-yellow-700">
                    All our plumbers are already booked on some of your selected dates. 
                    Each plumber can only handle one job at a time!
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Solutions -->
            <div class="space-y-2 sm:space-y-3">
              <h4 class="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                <span class="text-blue-600 mr-2 text-sm sm:text-base">💡</span>
                Try These Solutions:
              </h4>
              
              <div class="space-y-2">
                <div class="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <span class="text-blue-600 text-sm sm:text-base">📅</span>
                  <div>
                    <p class="font-medium text-blue-800 text-xs sm:text-sm">Adjust Your Dates</p>
                    <p class="text-xs text-blue-600">Try different date ranges</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                  <span class="text-green-600 text-sm sm:text-base">📋</span>
                  <div>
                    <p class="font-medium text-green-800 text-xs sm:text-sm">Check Existing Bookings</p>
                    <p class="text-xs text-green-600">See what dates are already taken</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Current Bookings Preview -->
            <div v-if="currentBookings.length > 0" class="bg-gray-50 rounded-lg p-3 sm:p-4">
              <h4 class="font-medium text-gray-700 mb-2 text-xs sm:text-sm">Your Current Bookings:</h4>
              <div class="space-y-1">
                <div v-for="(booking, index) in currentBookings.slice(0, 2)" :key="booking.id" 
                     class="text-xs text-gray-600 flex items-center justify-between">
                  <span class="truncate">{{ formatDateRange(booking.dates) }}</span>
                  <span class="font-medium flex-shrink-0">{{ booking.resourceDetails.length }} plumber{{ booking.resourceDetails.length > 1 ? 's' : '' }}</span>
                </div>
                <div v-if="currentBookings.length > 2" class="text-xs text-gray-500 italic">
                  ...and {{ currentBookings.length - 2 }} more
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Dialog Footer -->
        <div class="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 rounded-b-2xl border-t border-gray-200">
          <div class="flex space-x-2 sm:space-x-3">
            <button 
              @click="clearSelectionAndClose"
              class="flex-1 bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-xs sm:text-sm">
              🔄 Clear Selection
            </button>
            <button 
              @click="closeNoPlumbersDialog"
              class="flex-1 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm">
              ✅ Got it
            </button>
          </div>
        </div>
      </dialog>
      
      <!-- Fallback for non-dialog browsers -->
      <div v-else-if="availableResources.length === 0" class="text-center py-3 sm:py-4">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div class="flex items-center justify-center mb-2">
            <span class="text-yellow-600 text-xl mr-2">⚠️</span>
            <h4 class="font-medium text-yellow-800">Availability Conflict</h4>
          </div>
          <p class="text-sm text-yellow-700 mb-2">
            All plumbers are busy on some of your selected dates
          </p>
          <p class="text-xs text-yellow-600">
            💡 Try adjusting your date range or selecting different dates
          </p>
        </div>
        
        <div class="text-gray-600">
          <p class="font-medium text-sm mb-1">😔 No plumbers available for these dates</p>
          <p class="text-xs text-gray-500">Try different dates or check existing bookings</p>
        </div>
      </div>
      
      <!-- Resource list -->
      <div v-else class="space-y-2 sm:space-y-3">
        <label v-for="resource in availableResources" 
               :key="resource.id"
               class="flex items-center p-2 sm:p-3 bg-white rounded-lg cursor-pointer hover:bg-green-100 transition-all duration-200 border-2 border-transparent hover:border-green-300">
          <input type="checkbox" 
                 :value="resource.id" 
                 v-model="selectedResources"
                 class="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 text-green-600 rounded focus:ring-green-500">
          
          <div class="flex-1">
            <div class="flex items-center">
              <span class="text-xl sm:text-2xl mr-2">{{ resource.avatar }}</span>
              <div>
                <span class="font-medium text-gray-800 text-sm sm:text-base">{{ resource.displayName }}</span>
                <div class="text-xs sm:text-sm text-gray-500">
                  {{ resource.level.charAt(0).toUpperCase() + resource.level.slice(1) }} • ${{ resource.rate }}/hr
                </div>
                <div class="text-xs text-gray-400 mt-1 hidden sm:block">
                  {{ resource.specialties.join(' • ') }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-right">
            <div class="text-xs sm:text-sm font-medium text-green-600">
              Available ✅
            </div>
          </div>
        </label>
      </div>
      
      <!-- Selected resources summary -->
      <div v-if="selectedResources.length > 0" class="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-100 rounded-lg">
        <p class="text-xs sm:text-sm text-green-800">
          <strong>{{ selectedResources.length }}</strong> plumber{{ selectedResources.length > 1 ? 's' : '' }} selected
        </p>
        <p class="text-xs text-green-600 mt-1">
          Total: ${{ totalCost.toLocaleString() }} ({{ selectedDateRange.length }} days)
        </p>
      </div>
    </div>

    <!-- 🆕 Booking Actions -->
    <div v-if="selectedDateRange.length > 0" class="space-y-2 sm:space-y-3 resource-ui">
      <!-- Add to Booking Button -->
      <button @click="addBooking" 
              :disabled="!canAddBooking"
              class="w-full py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base disabled:bg-gray-300 disabled:cursor-not-allowed">
        � Add to Booking
        <span v-if="canAddBooking" class="ml-2 text-xs sm:text-sm">
          ({{ selectedResources.length }} plumber{{ selectedResources.length > 1 ? 's' : '' }}, ${{ totalCost.toLocaleString() }})
        </span>
      </button>
    </div>

    <!-- 🆕 Current Bookings Summary -->
    <div v-if="currentBookings.length > 0" class="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200 booking-ui">
      <h4 class="font-semibold text-yellow-800 mb-2 sm:mb-3 flex items-center justify-between text-sm sm:text-base">
        <span>📋 Current Bookings ({{ currentBookings.length }})</span>
        <button @click="clearAllBookings" 
                class="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium">
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
                {{ booking.resourceDetails.map(r => r.displayName).join(', ') }}
              </p>
            </div>
            <div class="text-right ml-2">
              <p class="font-medium text-green-600 text-sm sm:text-base">${{ booking.totalCost.toLocaleString() }}</p>
              <button @click="removeBooking(booking.id)" 
                      class="text-xs text-red-600 hover:text-red-800 mt-1">
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
          ${{ currentBookings.reduce((sum, b) => sum + b.totalCost, 0).toLocaleString() }})
        </span>
      </button>
    </div>

    <!-- Time slots will go here -->
    <!-- Confirmation will go here -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

// User's selected time slot - starts as null  
const selectedTimeSlot = ref(null)

// Current month being displayed in calendar - starts with today's month
const currentMonth = ref(new Date())

// 🎯 URL SYNC STATE
const route = useRoute()
const router = useRouter()

// 🎯 DRAG SELECTION STATE
const isDragging = ref(false)
const dragStart = ref(null)
const dragEnd = ref(null)
const selectedDateRange = ref([])
const justFinishedDrag = ref(false)

// � MULTI-RESOURCE BOOKING STATE
// Available plumbers/resources
const resources = ref([
  { 
    id: 'A', 
    name: 'John Smith', 
    displayName: 'John (Master Plumber)',
    rate: 150, 
    level: 'master',
    avatar: '👨‍🔧',
    specialties: ['Emergency', 'Repiping', 'Water Heaters'],
    available: true
  },
  { 
    id: 'B', 
    name: 'Mike Johnson', 
    displayName: 'Mike (Journeyman)',
    rate: 120, 
    level: 'journeyman',
    avatar: '👨‍🔧',
    specialties: ['Installations', 'Maintenance', 'Repairs'],
    available: true
  },
  { 
    id: 'C', 
    name: 'Tom Wilson', 
    displayName: 'Tom (Apprentice)',
    rate: 80, 
    level: 'apprentice',
    avatar: '👨‍🔧',
    specialties: ['Assistance', 'Basic Repairs', 'Learning'],
    available: true
  }
])

// Selected resources for current booking
const selectedResources = ref([])

// Accumulated bookings in current session
const currentBookings = ref([])

// Resource availability tracking (who's booked when)
const resourceBookings = ref([
  // Example: { resourceId: 'A', dates: [date1, date2], bookingId: 'booking1' }
])

// 🎯 DIALOG STATE
const noPlumbersDialog = ref(null)

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
// Available resources for selected date range
const availableResources = computed(() => {
  // If no dates selected, no resources available
  if (selectedDateRange.value.length === 0) return []
  
  return resources.value.filter(resource => {
    // Check if this plumber can work on ALL selected dates
    return canPlumberWorkOnDates(resource.id, selectedDateRange.value)
  })
})

// Helper: Check if a specific plumber can work on given dates
const canPlumberWorkOnDates = (plumberId, dates) => {
  // Look for any existing booking that conflicts
  const hasConflictingBooking = resourceBookings.value.some(booking => {
    // Same plumber?
    if (booking.resourceId !== plumberId) return false
    
    // Any date overlap?
    return dates.some(selectedDate => {
      return booking.dates.some(bookedDate => {
        return bookedDate.toDateString() === selectedDate.toDateString()
      })
    })
  })
  
  // Plumber can work if there are NO conflicting bookings
  return !hasConflictingBooking
}

// Selected resources details
const selectedResourcesDetails = computed(() => {
  return selectedResources.value.map(resourceId => {
    return resources.value.find(r => r.id === resourceId)
  }).filter(Boolean)
})

// Total cost for selected resources and dates
const totalCost = computed(() => {
  if (selectedResourcesDetails.value.length === 0 || selectedDateRange.value.length === 0) {
    return 0
  }
  
  const days = selectedDateRange.value.length
  const dailyRate = selectedResourcesDetails.value.reduce((sum, resource) => sum + resource.rate, 0)
  
  return days * dailyRate
})

// Can proceed with booking
const canAddBooking = computed(() => {
  return selectedDateRange.value.length > 0 && selectedResources.value.length > 0
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
}

const isSelected = (date) => {
  return selectedDate.value && 
         date && 
         selectedDate.value.toDateString() === date.toDateString()
}

const isCurrentMonth = (date) => {
  return date && date.getMonth() === currentMonth.value.getMonth()
}

const isAvailable = (date) => {
  return !!date
}

const isDisabled = (date) => {
  return false
}

const selectDate = (date) => {
  if (!date) return
  selectedDate.value = date
  emit('date-selected', date)
}

// 🎯 DRAG SELECTION METHODS
const startDrag = (event) => {
  event.preventDefault()
  const startDate = getDateFromPointerEvent(event)
  if (!startDate) return

  isDragging.value = true
  dragStart.value = startDate
  dragEnd.value = startDate
  updateDateRange()
}

const updateDrag = (event) => {
  if (!isDragging.value) return
  const endDate = getDateFromPointerEvent(event)
  if (!endDate) return

  dragEnd.value = endDate
  updateDateRange()
}

 

const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    justFinishedDrag.value = true
    setTimeout(() => justFinishedDrag.value = false, 300)

    if (selectedDateRange.value.length > 0) {
      const start = selectedDateRange.value[0].toISOString().split('T')[0]
      const end = selectedDateRange.value[selectedDateRange.value.length - 1].toISOString().split('T')[0]
      
      // Update URL
      router.push({
        query: { start, end }
      })
    }
    
    emit('date-range-selected', selectedDateRange.value)
  }
}

const getDateFromPointerEvent = (event) => {
  if (!event) return null

  let el = null

  if (event.touches && event.touches[0]) {
    
    const { clientX, clientY } = event.touches[0]
    el = document.elementFromPoint(clientX, clientY)
  } else if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
    el = document.elementFromPoint(event.clientX, event.clientY)
  } else {
    el = event.target
  }

  const dateEl = el?.closest?.('[data-date]')
  const iso = dateEl?.getAttribute?.('data-date')
  if (!iso) return null

  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d
}

const updateDateRange = () => {
  if (!dragStart.value || !dragEnd.value) return

  
  // Determine the chronological start and end of the drag selection
  // (dragging can go forward or backward)
  const rangeStart = dragStart.value < dragEnd.value ? dragStart.value : dragEnd.value
  const rangeEnd = dragStart.value > dragEnd.value ? dragStart.value : dragEnd.value

  // Add all dates between rangeStart and rangeEnd
  const currentDate = new Date(rangeStart)
  while (currentDate <= rangeEnd) {
    // Only add if not already in the array (avoid duplicates during drag)
    const dateStr = currentDate.toDateString()
    const alreadyExists = selectedDateRange.value.some(d => {
      return d.toDateString() === dateStr
    })
    if (!alreadyExists) {
      selectedDateRange.value.push(new Date(currentDate))
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
}

const isInDragRange = (date) => {
  
  return selectedDateRange.value.some(rangeDate => 
    rangeDate.toDateString() === date?.toDateString()
  )
}

// Clear current selection (dates and resources)
const clearSelection = () => {
  selectedDateRange.value = []
  selectedResources.value = []
  selectedDate.value = null
}

// 🎯 DIALOG METHODS
// Watch for when no plumbers are available and show dialog
watch(availableResources, (newVal) => {
  if (newVal.length === 0 && selectedDateRange.value.length > 0) {
    showNoPlumbersDialog()
  }
})

// Show the no plumbers dialog
const showNoPlumbersDialog = () => {
  if (noPlumbersDialog.value) {
    noPlumbersDialog.value.showModal()
  }
}

// Close the no plumbers dialog
const closeNoPlumbersDialog = () => {
  if (noPlumbersDialog.value) {
    noPlumbersDialog.value.close()
  }
}

// Clear selection and close dialog
const clearSelectionAndClose = () => {
  clearSelection()
  closeNoPlumbersDialog()
}

//  MULTI-RESOURCE BOOKING METHODS
// Add current selection to accumulated bookings
const addBooking = () => {
  if (!canAddBooking.value) return
  
  const booking = {
    id: `booking_${Date.now()}`,
    dates: [...selectedDateRange.value],
    resources: [...selectedResources.value],
    resourceDetails: [...selectedResourcesDetails.value],
    totalCost: totalCost.value,
    createdAt: new Date()
  }
  
  currentBookings.value.push(booking)
  
  // Update resource availability tracking
  selectedResources.value.forEach(resourceId => {
    resourceBookings.value.push({
      resourceId: resourceId,
      dates: [...selectedDateRange.value],
      bookingId: booking.id
    })
  })
  
  // Clear current selection for next booking
  selectedDateRange.value = []
  selectedResources.value = []
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

<style scoped>
.booking-calendar {
  /* We'll add styles in Step 4 */
}
</style>
