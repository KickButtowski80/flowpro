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
        
        <!-- Recent Activity Feed -->
        <div v-if="bookingResult" class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">📋</span>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-gray-800 mb-1">Recent Activity</h3>
              <p class="text-sm text-gray-700 leading-relaxed">{{ bookingResult }}</p>
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
  bookingResult.value = `Booking added: ${booking.dates.length} day${booking.dates.length > 1 ? 's' : ''} with ${booking.plumbers.length} plumber${booking.plumbers.length > 1 ? 's' : ''} - $${booking.totalCost.toLocaleString()}`
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
