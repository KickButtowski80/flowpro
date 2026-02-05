<template>
  <div class="booking-calendar">
    <!-- Calendar Header -->
    <div class="text-center mb-6">
      <h3 class="text-xl font-semibold mb-2">📅 Select Your Service Date</h3>
      <p class="text-gray-600">Choose when you'd like our plumbing service</p>
    </div>

    <div class="flex justify-between items-center mb-4">
      <button @click="previousMonth"
        class="relative p-2 rounded-lg transition-all duration-300 flex items-center justify-center w-10 h-10 hover:bg-blue-50 active:scale-95 group"
        aria-label="Previous month">
        <svg
          class="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-all duration-300 group-hover:-translate-x-1"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <h4 class="font-medium">{{ currentMonthDisplay }}</h4>

      <button @click="nextMonth"
        class="relative p-2 rounded-lg transition-all duration-300 flex items-center justify-center w-10 h-10 hover:bg-blue-50 active:scale-95 group"
        aria-label="Next month">
        <svg
          class="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-all duration-300 group-hover:translate-x-1"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 mb-6">
      <!-- Weekday headers -->
      <div class="text-center text-sm font-medium p-2">Sun</div>
      <div class="text-center text-sm font-medium p-2">Mon</div>
      <div class="text-center text-sm font-medium p-2">Tue</div>
      <div class="text-center text-sm font-medium p-2">Wed</div>
      <div class="text-center text-sm font-medium p-2">Thu</div>
      <div class="text-center text-sm font-medium p-2">Fri</div>
      <div class="text-center text-sm font-medium p-2">Sat</div>

      <!-- Calendar days will go here -->
      <div v-for="day in calendarDays" :key="day.date"
        class="text-center p-2 border rounded cursor-pointer hover:bg-blue-50" :class="{
          'bg-blue-100': isSelected(day.date),
          'text-gray-400': !isCurrentMonth(day.date),
          'bg-green-100': isAvailable(day.date)
        }" @click="selectDate(day.date)">
        {{ day.day }}
      </div>
    </div>

    <!-- Selected Date Display -->
    <div class="mb-6 p-4 bg-gray-50 rounded">
      <h4 class="font-medium mb-2">📍 You Selected:</h4>
      <p class="text-lg">{{ formattedDate }}</p>
    </div>

    <!-- Time slots will go here -->
    <!-- Confirmation will go here -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
  'booking-confirmed'   // When user confirms booking
])

// 🎯 STEP 2: Add Reactive State
// User's selected date - starts as null (nothing selected)
const selectedDate = ref(null)

// User's selected time slot - starts as null  
const selectedTimeSlot = ref(null)

// Current month being displayed in calendar - starts with today's month
const currentMonth = ref(new Date())

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
  return date && props.availableDates.some(availableDate =>
    availableDate.toDateString() === date.toDateString()
  )
}

const selectDate = (date) => {
  if (date && isAvailable(date)) {
    selectedDate.value = date
    emit('date-selected', date)
  }
}

// 🎯 STEP 4: Build Template (Next)
// 🎯 STEP 5: Add Methods (Next)
</script>

<style scoped>
.booking-calendar {
  /* We'll add styles in Step 4 */
}
</style>
