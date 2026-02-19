<template>
  <div class="calendar-test-page" id="calendar">
    <div class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg py-6 md:p-32">
        <BookingCalendar
          @date-range-selected="handleDateRangeSelected"
          @booking-added="handleBookingAdded"
          @all-bookings-cleared="handleAllBookingsCleared"
          @booking-removed="handleBookingRemoved"
          @proceed-to-checkout="handleCheckout"
        />
        
        <!-- Event Results Display -->
        <div v-if="bookingResult" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="text-sm font-semibold text-blue-800 mb-2">📋 Event Result:</h3>
          <p class="text-sm text-blue-700">{{ bookingResult }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BookingCalendar from '~/components/BookingCalendar.vue'

const bookingResult = ref(null)

// Handle date range selection from CalendarGrid
const handleDateRangeSelected = (dateRange) => {
  console.log('Date range selected:', dateRange)
  bookingResult.value = `Selected ${dateRange.length} day${dateRange.length > 1 ? 's' : ''}: ${dateRange.map(d => d.toDateString()).join(' → ')}`
}

// Handle booking added to accumulation
const handleBookingAdded = (booking) => {
  console.log('Booking added:', booking)
  bookingResult.value = `Booking added: ${booking.dates.length} day${booking.dates.length > 1 ? 's' : ''} with ${booking.resources.length} plumber${booking.resources.length > 1 ? 's' : ''} - $${booking.totalCost}`
}

// Handle all bookings cleared
const handleAllBookingsCleared = () => {
  console.log('All bookings cleared')
  bookingResult.value = 'All bookings have been cleared'
}

// Handle individual booking removed
const handleBookingRemoved = (bookingId) => {
  console.log('Booking removed:', bookingId)
  bookingResult.value = `Booking ${bookingId} has been removed`
}

// Handle checkout request
const handleCheckout = (checkoutData) => {
  console.log('Proceeding to checkout:', checkoutData)
  bookingResult.value = `Proceeding to checkout with ${checkoutData.bookings.length} bookings, total: $${checkoutData.totalCost}`
}
</script>

<style scoped>
.calendar-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
