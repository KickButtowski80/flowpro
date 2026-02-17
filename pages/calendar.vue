<template>
  <div class="calendar-test-page" id="calendar">
    <div class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg py-6 md:p-32">
        <BookingCalendar
          :available-dates="availableDates"
          :booked-slots="bookedSlots"
          :min-date="minDate"
          @date-selected="handleDateSelected"
          @time-slot-selected="handleTimeSlotSelected"
          @booking-confirmed="handleBookingConfirmed"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BookingCalendar from '~/components/BookingCalendar.vue'

const availableDates = [
  new Date(2024, 11, 15),
  new Date(2024, 11, 16),
  new Date(2024, 11, 17),
]

const bookedSlots = [
  { date: 'Mon Dec 16 2024', time: '10:00 AM' },
  { date: 'Mon Dec 16 2024', time: '2:00 PM' },
]

const minDate = new Date()
const bookingResult = ref(null)

const handleDateSelected = (date) => {
  console.log('Date selected:', date)
}

const handleTimeSlotSelected = (timeSlot) => {
  console.log('Time slot selected:', timeSlot)
}

const handleBookingConfirmed = (bookingData) => {
  bookingResult.value = `Service booked for ${bookingData.date} at ${bookingData.time}`
}
</script>

<style scoped>
.calendar-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
