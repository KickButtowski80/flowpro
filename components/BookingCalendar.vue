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
    <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-6 select-none touch-none"
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
           text-sm sm:text-base border-2 rounded-xl transition-transform duration-300 relative"
           :data-date="day.date ? day.date.toISOString() : ''"
           :class="{
             'cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-300 transform hover:scale-105 shadow-sm hover:shadow-md': !isDateBusy(day.date),
             'cursor-not-allowed': isDateBusy(day.date),
             'bg-gradient-to-br from-blue-400 to-indigo-500 text-white border-blue-500 shadow-lg ring-2 ring-blue-300': isSelected(day.date),
             'text-gray-400 opacity-50': !isCurrentMonth(day.date),
             'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200 hover:from-emerald-200 hover:to-teal-200': isAvailable(day.date) && !isDateBusy(day.date),
             'bg-gradient-to-br from-red-200 to-red-400 border-red-500 opacity-70 cursor-not-allowed': isDateBusy(day.date),
             'bg-gradient-to-br from-purple-200 to-pink-200 border-purple-300 animate-pulse': isInDragRange(day.date)
           }"
           @click="!isDateBusy(day.date) && selectDate(day.date)">
        {{ day.day }}
        <span v-if="isDateBusy(day.date)" class="absolute top-0.5 right-0.5 text-xs animate-pulse">🔒</span>
        <span v-if="isSelected(day.date)" class="absolute top-0.5 left-0.5 text-xs">✨</span>
        <span v-if="isInDragRange(day.date)" class="absolute top-0.5 left-0.5 text-xs">🎯</span>
      </div>
    </div>

    <!-- 🎨 Color Legend -->
    <div class="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 class="font-semibold text-gray-800 mb-3 text-sm sm:text-base">🎨 Calendar Legend:</h4>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <!-- Available -->
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-200 rounded"></div>
          <span class="text-xs text-gray-700">Available</span>
        </div>
        
        <!-- Selected -->
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-blue-500 rounded"></div>
          <span class="text-xs text-gray-700">Selected</span>
        </div>
        
        <!-- Busy -->
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gradient-to-br from-red-200 to-red-400 border-2 border-red-500 rounded opacity-70"></div>
          <span class="text-xs text-gray-700">Busy 🔒</span>
        </div>
        
        <!-- Dragging -->
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gradient-to-br from-purple-200 to-pink-200 border-2 border-purple-300 rounded"></div>
          <span class="text-xs text-gray-700">Dragging 🎯</span>
        </div>
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
      
      <!-- No resources available message -->
      <div v-if="availableResources.length === 0" class="text-center py-3 sm:py-4">
        <p class="text-red-600 font-medium text-sm sm:text-base">😔 No plumbers available for these dates</p>
        <p class="text-xs sm:text-sm text-gray-600 mt-1">Try different dates or check existing bookings</p>
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
  if (!date || isDateBusy(date)) return
  selectedDate.value = date
  emit('date-selected', date)
}

// 🎯 DRAG SELECTION METHODS
const startDrag = (event) => {
  event.preventDefault()
  const startDate = getDateFromPointerEvent(event)
  if (!startDate || isDateBusy(startDate)) return

  isDragging.value = true
  dragStart.value = startDate
  dragEnd.value = startDate
  updateDateRange()
}

const updateDrag = (event) => {
  if (!isDragging.value) return
  const endDate = getDateFromPointerEvent(event)
  if (!endDate || isDateBusy(endDate)) return

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

  // Create date range (dragging can go forward or backward)
  const rangeStart = dragStart.value < dragEnd.value ? dragStart.value : dragEnd.value
  const rangeEnd = dragStart.value > dragEnd.value ? dragStart.value : dragEnd.value

  // Add all dates between rangeStart and rangeEnd (skip busy dates)
  const currentDate = new Date(rangeStart)
  const tempDateRange = []
  while (currentDate <= rangeEnd) {
    // Skip busy dates
    if (!isDateBusy(currentDate)) {
      // Only add if not already in the array (avoid duplicates during drag)
      const dateStr = currentDate.toDateString()
      const alreadyExists = tempDateRange.some(d => {
        return d.toDateString() === dateStr
      })
      if (!alreadyExists) {
        tempDateRange.push(new Date(currentDate))
      }
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Update the selected date range
  selectedDateRange.value = tempDateRange
}

const isInDragRange = (date) => {
  
  return selectedDateRange.value.some(rangeDate => 
    rangeDate.toDateString() === date?.toDateString()
  )
}

// 🆕 Check if a date has any bookings (busy)
const isDateBusy = (date) => {
  if (!date) return false
  
  return resourceBookings.value.some(booking => {
    return booking.dates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    )
  })
}

// Clear current selection (dates and resources)
const clearSelection = () => {
  debugger;
  selectedDateRange.value = []
  selectedResources.value = []
  selectedDate.value = null
}

// 🆕 MULTI-RESOURCE BOOKING METHODS
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
