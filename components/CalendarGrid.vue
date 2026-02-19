<template>
     <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-6 select-none touch-none" 
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseLeave"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @touchcancel="handleTouchCancel">
      <!-- Weekday headers -->
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Sun</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Mon</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Tue</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Wed</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Thu</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Fri</div>
      <div class="text-center text-xs sm:text-sm font-medium p-1 sm:p-2">Sat</div>

      <!-- Calendar days will go here -->
      <div v-for="day in calendarDays" :key="day.date" class="text-center p-3 sm:p-2 min-h-[44px] sm:min-h-0 
           text-sm sm:text-base border-2 rounded-xl transition-transform duration-300 relative"
        :data-date="day.date ? day.date.toISOString() : ''" :class="{
          'cursor-pointer bg-gradient-to-br from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 border-emerald-200 transform hover:scale-105 shadow-sm hover:shadow-md': isAvailableAndNotSelected(day.date),
          'cursor-not-allowed': isDateBusy(day.date),
          'bg-gradient-to-br from-blue-300/80 to-indigo-400/80 dark:from-blue-600/80 dark:to-indigo-700/80 text-gray-800 dark:text-white border-blue-400 dark:border-blue-500 shadow-lg ring-2 ring-blue-300/50 dark:ring-blue-400/50': isDateSelected(day.date) && !isDateBusy(day.date),
          'text-gray-400 opacity-50': !isCurrentMonth(day.date),
          'bg-gradient-to-br from-amber-300 to-amber-500 border-amber-600 opacity-90 cursor-pointer': isSemiBusyAndNotSelected(day.date),
          'bg-gradient-to-br from-red-200 to-red-400 border-red-500 opacity-70 cursor-not-allowed': isDateBusy(day.date),
          'bg-gradient-to-br from-purple-200 to-pink-200 border-purple-300 animate-pulse': isInDragRange(day.date)
        }" @click="selectDate(day)">
        {{ day.day }}
        <span v-if="isDateBusy(day.date)" class="absolute top-0.5 right-0.5 text-xs animate-pulse">🔒</span>
        <span v-if="isDateSemiBusy(day.date)" class="absolute top-0.5 right-0.5 text-xs">⚠️</span>
        <span v-if="isDateSelected(day.date)" class="absolute top-0.5 left-0.5 text-xs">✨</span>
        <span v-if="isInDragRange(day.date)" class="absolute top-0.5 left-0.5 text-xs">🎯</span>
      </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props received from parent
const props = defineProps({
  calendarDays: {
    type: Array,
    required: true
  },
  selectedDates: {
    type: Array,
    default: () => []
  },
  // TODO: FUTURE USE - Time slot selection in calendar grid
  // Currently not used, but keeping for potential time slot integration
  // Uncomment when implementing time slots directly in calendar
  // selectedDate: {
  //   type: Date,
  //   default: null
  // },
  // Data needed for calculations
  resourceBookings: {
    type: Array,
    default: () => []
  },
  resources: {
    type: Array,
    default: () => []
  },
  currentMonth: {
    type: Date,
    required: true
  }
})

// Events emitted to parent - ONLY for date selection, no drag events needed
const emit = defineEmits([
  'selected-date'
])

// 🆕 Computed property: Booked plumbers organized by date for O(1) lookups
// Automatically rebuilds when resourceBookings changes
const bookedPlumbersByDate = computed(() => {
  const plumbersByDateMap = new Map() // date string -> Set of plumber IDs
  
  props.resourceBookings.forEach(booking => {
    booking.dates.forEach(bookedDate => {
      const dateKey = bookedDate.toDateString()
      if (!plumbersByDateMap.has(dateKey)) {
        plumbersByDateMap.set(dateKey, new Set())
      }
      plumbersByDateMap.get(dateKey).add(booking.resourceId)
    })
  })
  
  return plumbersByDateMap
})

// 🆕 Helper: Get booked plumber IDs for a specific date
// Now O(1) lookup instead of O(N × M) nested loops!
const getBookedPlumberIds = (date) => {
  if (!date) return new Set()  // Return empty Set for consistency
  
  return bookedPlumbersByDate.value.get(date.toDateString()) || new Set()
}

// 🆕 Check if a date has any bookings (busy)
const isDateBusy = (date) => {
  if (!date) return false
  const totalPlumbers = props.resources.length
  if (totalPlumbers === 0) return false

  const bookedPlumberIds = getBookedPlumberIds(date)
  const bookedCount = bookedPlumberIds.size

  // Fully busy only when all plumbers are booked on this date
  return bookedCount === totalPlumbers
}

// 🆕 Check if a date has partial bookings (some plumbers busy, others available)
const isDateSemiBusy = (date) => {
  if (!date) return false

  const totalPlumbers = props.resources.length
  if (totalPlumbers === 0) return false

  const bookedPlumberIds = getBookedPlumberIds(date)
  const bookedCount = bookedPlumberIds.size

  // Semi-busy if some plumbers are booked but not all
  return bookedCount > 0 && bookedCount < totalPlumbers
}

// 🆕 Computed property for optimized date lookup
// Convert selectedDates array to Set for O(1) lookup instead of O(N)
const selectedDateSet = computed(() => {
  return new Set(props.selectedDates.map(d => d.toDateString()))
})

const isDateSelected = (date) => {
  if (!date) return false
  // O(1) lookup instead of O(N) with some()
  return selectedDateSet.value.has(date.toDateString())
}

const isCurrentMonth = (date) => {
  return date && date.getMonth() === props.currentMonth.getMonth()
}

const isValidDate = (date) => {
  return !!date  // Check if date is valid (not null/undefined)
}

// 🆕 Computed property for optimized drag range lookup
// Convert currentDragRange array to Set for O(1) lookup instead of O(N)
const dragRangeSet = computed(() => {
  return new Set(currentDragRange.value.map(d => d.toDateString()))
})

const isInDragRange = (date) => {
  // O(1) lookup instead of O(N) with some()
  return dragRangeSet.value.has(date?.toDateString())
}

// 🆕 Computed properties for cleaner template logic
// Available = valid date + not fully booked (semi-busy is still available!) + not selected
const isAvailableAndNotSelected = (date) => {
  return isValidDate(date) && !isDateBusy(date) && !isDateSelected(date)
}

const isSemiBusyAndNotSelected = (date) => {
  return isDateSemiBusy(date) && !isDateSelected(date)
}

// 🆕 Drag state (managed locally in CalendarGrid)
const isDragging = ref(false)
const dragStart = ref(null)
const dragEnd = ref(null)
const currentDragRange = ref([])

// 🆕 Helper to get date from pointer event
const getDateFromPointerEvent = (event) => {
  const target = event.target
  const dateElement = target.closest('[data-date]')
  if (!dateElement) return null
  
  const dateString = dateElement.getAttribute('data-date')
  return dateString ? new Date(dateString) : null
}

// 🆕 Drag selection methods (now in CalendarGrid)
const startDrag = (event) => {
  event.preventDefault()
  const startDate = getDateFromPointerEvent(event)
  
  // Only block dragging on fully busy dates (all plumbers booked)
  // Allow dragging on limited/semi-busy dates (some plumbers still available)
  if (!startDate) return
  if (isDateBusy(startDate)) return

  isDragging.value = true
  dragStart.value = startDate
  dragEnd.value = startDate
}

const updateDrag = (event) => {
  if (!isDragging.value) return
  const endDate = getDateFromPointerEvent(event)
  // Only block dragging on fully busy dates (all plumbers booked)
  // Allow dragging over limited/semi-busy dates (some plumbers still available)
  if (!endDate || isDateBusy(endDate)) return

  dragEnd.value = endDate
  
  // 🚀 Update visual range immediately during drag!
  currentDragRange.value = getDateRange(dragStart.value, dragEnd.value)
}

const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    
    // Emit the selected date range to parent
    if (dragStart.value && dragEnd.value) {
      const dateRange = getDateRange(dragStart.value, dragEnd.value)
      emit('selected-date', dateRange)
    }
    
    // Clear local drag state
    currentDragRange.value = []
    dragStart.value = null
    dragEnd.value = null
  }
}

// 🆕 Helper to get date range
const getDateRange = (start, end) => {
  const dateRange = []
  const currentDate = new Date(start)
  const endDate = new Date(end)
  
  while (currentDate <= endDate) {
    dateRange.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dateRange
}

// Event handlers - now handle drag locally
const handleMouseDown = (event) => {
  startDrag(event)
}

const handleMouseMove = (event) => {
  updateDrag(event)
}

const handleMouseUp = () => {
  endDrag()
}

const handleMouseLeave = () => {
  endDrag()
}

const handleTouchStart = (event) => {
  startDrag(event)
}

const handleTouchMove = (event) => {
  updateDrag(event)
}

const handleTouchEnd = () => {
  endDrag()
}

const handleTouchCancel = () => {
  endDrag()
}

// Date selection handler
const selectDate = (day) => {
  if (day.date && !isDateBusy(day.date)) {
    emit('selected-date', [day.date]) // Emit as array for consistency
  }
}
</script>