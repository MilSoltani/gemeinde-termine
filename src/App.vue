<script setup lang="ts">
import { computed, ref } from 'vue'

const events = ref([
  {
    id: 1,
    title: 'Team Meeting',
    date: '2026-05-05',
    time: '10:00',
  },
  {
    id: 2,
    title: 'Doctor Appointment bei Dr Höcke in Krankenhaus',
    date: '2026-05-12',
    time: '09:00',
  },
  {
    id: 3,
    title: 'Birthday Party bei Dr Höcke in Krankenhaus',
    date: '2026-05-12',
    time: '18:30',
  },
  {
    id: 4,
    title: 'Conference',
    date: '2026-05-20',
    time: '14:00',
  },
])

const currentDate = ref(new Date())

const weekdays = ['Mon', 'Die', 'Mit', 'Don', 'Frei', 'Sam', 'Son']

const currentYear = computed(() => currentDate.value.getFullYear())

const currentMonth = computed(() => currentDate.value.getMonth())

const monthName = computed(() => {
  return currentDate.value.toLocaleString('default', {
    month: 'long',
  })
})

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const daysInMonth = lastDay.getDate()

  let startDay = firstDay.getDay()
  startDay = startDay === 0 ? 6 : startDay - 1

  const days = []

  for (let i = 0; i < startDay; i++) {
    days.push({
      date: `empty-${i}`,
      day: '',
      currentMonth: false,
      events: [],
    })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    const dayEvents = events.value
      .filter(event => event.date === date)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''))

    days.push({
      date,
      day,
      currentMonth: true,
      events: dayEvents,
    })
  }

  return days
})

function prevMonth() {
  currentDate.value = new Date(
    currentYear.value,
    currentMonth.value - 1,
    1,
  )
}

function nextMonth() {
  currentDate.value = new Date(
    currentYear.value,
    currentMonth.value + 1,
    1,
  )
}
</script>

<template>
  <div class="calendar">
    <div class="header">
      <img src="/logo.svg" alt="FEG-Langenfeld" width="160px">

      <div>
        <button @click="prevMonth">
          ‹
        </button>
        <button @click="nextMonth">
          ›
        </button>
      </div>

      <div class="monthday">
        Die Termine im <h2>{{ monthName }} {{ currentYear }}</h2>
      </div>
    </div>

    <div class="container">
      <div class="weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">
          {{ day }}
        </div>
      </div>

      <div class="days">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="day"
          :class="{ empty: !day.currentMonth }"
        >
          <div class="day-number">
            {{ day.day }}
          </div>

          <div class="events">
            <div
              v-for="event in day.events"
              :key="event.id"
              class="event"
            >
              <span class="event-title">
                <span v-if="event.time" class="event-time">{{ event.time }}</span>
                {{ event.title }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
