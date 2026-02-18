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
          'cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-300 transform hover:scale-105 shadow-sm hover:shadow-md': !isDateBusy(day.date) && !isDateSemiBusy(day.date),
          'cursor-not-allowed': isDateBusy(day.date),
          'bg-gradient-to-br from-blue-400 to-indigo-500 text-white border-blue-500 shadow-lg ring-2 ring-blue-300': isSelected(day.date),
          'text-gray-400 opacity-50': !isCurrentMonth(day.date),
          'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200 hover:from-emerald-200 hover:to-teal-200': isAvailable(day.date) && !isDateBusy(day.date) && !isDateSemiBusy(day.date),
          'bg-gradient-to-br from-amber-300 to-amber-500 border-amber-600 opacity-90 cursor-pointer': isDateSemiBusy(day.date),
          'bg-gradient-to-br from-red-200 to-red-400 border-red-500 opacity-70 cursor-not-allowed': isDateBusy(day.date),
          'bg-gradient-to-br from-purple-200 to-pink-200 border-purple-300 animate-pulse': isInDragRange(day.date)
        }" @click="selectDate(day)">
        {{ day.day }}
        <span v-if="isDateBusy(day.date)" class="absolute top-0.5 right-0.5 text-xs animate-pulse">🔒</span>
        <span v-if="isDateSemiBusy(day.date)" class="absolute top-0.5 right-0.5 text-xs">⚠️</span>
        <span v-if="isSelected(day.date)" class="absolute top-0.5 left-0.5 text-xs">✨</span>
        <span v-if="isInDragRange(day.date)" class="absolute top-0.5 left-0.5 text-xs">🎯</span>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

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
  },
  selectedDate: {
    type: Date,
    default: null
  }
})

// Events emitted to parent - ONLY for date selection, no drag events needed
const emit = defineEmits([
  'date-selected'
])

// 🆕 Helper: Get count of plumbers booked on a specific date
const getBookedPlumbersCount = (date) => {
  if (!date) return 0

  const bookedPlumbers = new Set()

  props.resourceBookings.forEach(booking => {
    booking.dates.forEach(bookedDate => {
      if (bookedDate.toDateString() === date.toDateString()) {
        bookedPlumbers.add(booking.resourceId)
      }
    })
  })

  return bookedPlumbers.size
}

// 🆕 Check if a date has any bookings (busy)
const isDateBusy = (date) => {
  if (!date) return false
  const totalPlumbers = props.resources.length
  if (totalPlumbers === 0) return false

  const bookedCount = getBookedPlumbersCount(date)

  // Fully busy only when all plumbers are booked on this date
  return bookedCount === totalPlumbers
}

// 🆕 Check if a date has partial bookings (some plumbers busy, others available)
const isDateSemiBusy = (date) => {
  if (!date) return false

  const totalPlumbers = props.resources.length
  if (totalPlumbers === 0) return false

  const bookedCount = getBookedPlumbersCount(date)

  // Semi-busy if some plumbers are booked but not all
  return bookedCount > 0 && bookedCount < totalPlumbers
}

const isSelected = (date) => {
  return props.selectedDate &&
    date &&
    props.selectedDate.toDateString() === date.toDateString()
}

const isCurrentMonth = (date) => {
  return date && date.getMonth() === props.currentMonth.getMonth()
}

const isAvailable = (date) => {
  return !!date
}

const isInDragRange = (date) => {
  return props.selectedDates.some(rangeDate =>
    rangeDate.toDateString() === date?.toDateString()
  )
}

// 🆕 Drag state (managed locally in CalendarGrid)
const isDragging = ref(false)
const dragStart = ref(null)
const dragEnd = ref(null)

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
}

const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    
    // Emit the selected date range to parent
    if (dragStart.value && dragEnd.value) {
      const dateRange = getDateRange(dragStart.value, dragEnd.value)
      emit('date-selected', dateRange)
    }
    
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
    emit('date-selected', [day.date]) // Emit as array for consistency
  }
}
</script>