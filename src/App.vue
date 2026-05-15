<script setup lang="ts">
import { computed, ref } from 'vue'

const events = ref([
  { id: 1, title: 'Team Meeting', date: '2026-05-05', time: '10:00' },
  { id: 2, title: 'Doctor Appointment bei Dr Höcke in Krankenhaus', date: '2026-05-12', time: '09:00' },
  { id: 3, title: 'Birthday Party bei Dr Höcke in Krankenhaus', date: '2026-05-12', time: '18:30' },
  { id: 4, title: 'Birthday Party bei Dr Höcke in Krankenhaus', date: '2026-05-12', time: '18:30' },
  { id: 5, title: 'Bibel lesen - Bibel leben', date: '2026-05-20', time: '14:00' },
  { id: 6, title: 'Gottesdienst Stefanie Koch / Heike Schilbach', date: '2026-05-03', time: '10:00' },
  { id: 7, title: 'Gemeindeforum', date: '2026-05-03', time: '12:30' },
  { id: 8, title: 'Gottesdienst Abendmahl Stefanie Koch / Heike Schilbach', date: '2026-05-10', time: '10:00' },
  { id: 9, title: 'Cafe International', date: '2026-05-21', time: '15:00' },

  { id: 10, title: 'Jugendkreis', date: '2026-05-08', time: '19:00' },
  { id: 11, title: 'Elternabend Schule', date: '2026-05-14', time: '18:00' },
  { id: 12, title: 'Lobpreisabend', date: '2026-05-16', time: '20:00' },
  { id: 13, title: 'Seniorencafé', date: '2026-05-18', time: '15:30' },
  { id: 14, title: 'Projektbesprechung', date: '2026-05-22', time: '11:00' },
  { id: 15, title: 'Männerfrühstück', date: '2026-05-23', time: '08:30' },
  { id: 16, title: 'Kinderchor Probe', date: '2026-05-27', time: '16:00' },
  { id: 17, title: 'Open-Air Gottesdienst', date: '2026-05-31', time: '11:00' },

  { id: 18, title: 'Sommerfest Planung', date: '2026-06-02', time: '17:30' },
  { id: 19, title: 'Bibelkreis', date: '2026-06-04', time: '19:00' },
  { id: 20, title: 'Arzttermin Zahnarztpraxis Müller', date: '2026-06-09', time: '08:15' },
  { id: 21, title: 'Team Lunch', date: '2026-06-11', time: '12:00' },
  { id: 22, title: 'Jugendgottesdienst', date: '2026-06-14', time: '18:00' },
  { id: 23, title: 'Wandertag Taunus', date: '2026-06-18', time: '09:00' },
  { id: 24, title: 'Sommerkonzert Gemeinde', date: '2026-06-20', time: '19:30' },
  { id: 25, title: 'Gebetsabend', date: '2026-06-24', time: '20:00' },
  { id: 26, title: 'Familienbrunch', date: '2026-06-28', time: '10:30' },
])

const currentDate = ref(new Date())

const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

const monthName = computed(() =>
  currentDate.value.toLocaleString('default', { month: 'long' }),
)

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const daysInMonth = lastDay.getDate()
  const startDay = firstDay.getDay()

  const totalCells = 42

  const days: any[] = []

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - startDay + 1

    if (dayNumber < 1 || dayNumber > daysInMonth) {
      days.push({
        empty: true,
        date: `empty-${i}`,
        day: '',
        events: [],
      })
    }
    else {
      const date = formatDate(new Date(year, month, dayNumber))

      const dayEvents = events.value
        .filter(e => e.date === date)
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))

      days.push({
        empty: false,
        date,
        day: dayNumber,
        events: dayEvents,
      })
    }
  }

  return days
})

function prevMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}
</script>

<template>
  <div class="calendar">
    <div class="header">
      <img src="/logo.svg" alt="FEG-Langenfeld" height="25px">

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
          :class="{ empty: day.empty }"
        >
          <div class="day-number">
            {{ day.day }}
          </div>

          <div class="events">
            <div v-for="event in day.events" :key="event.id" class="event">
              <span class="event-title">
                <span v-if="event.time" class="event-time">
                  {{ event.time }}
                </span>
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
