<script setup lang="ts">
import { computed, ref } from 'vue'

interface EventItem {
  id: number
  title: string
  date: string
  time: string
}

const events = ref<EventItem[]>([])

const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

const form = ref({
  id: null as number | null,
  title: '',
  date: '',
  time: '',
})

const isEditing = computed(() => form.value.id !== null)

function resetForm() {
  form.value = {
    id: null,
    title: '',
    date: '',
    time: '',
  }
}

function addEvent() {
  if (!form.value.title || !form.value.date)
    return

  const newEvent: EventItem = {
    id: Date.now(),
    title: form.value.title,
    date: form.value.date,
    time: form.value.time,
  }

  events.value.push(newEvent)

  resetForm()
}

function selectEvent(event: EventItem) {
  form.value = { ...event }
}

function updateEvent() {
  if (form.value.id === null)
    return

  const index = events.value.findIndex(e => e.id === form.value.id)

  if (index === -1)
    return

  events.value[index] = {
    id: form.value.id,
    title: form.value.title,
    date: form.value.date,
    time: form.value.time,
  }

  resetForm()
}

function deleteEvent() {
  if (form.value.id === null)
    return

  events.value = events.value.filter(e => e.id !== form.value.id)

  resetForm()
}

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function createMonthData(baseDate: Date, offset: number) {
  const date = new Date(baseDate.getFullYear(), baseDate.getMonth() + offset, 1)

  const year = date.getFullYear()
  const month = date.getMonth()

  const monthName = date.toLocaleString('de-DE', { month: 'long' })

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
        date: `empty-${offset}-${i}`,
        day: '',
        events: [],
      })
    }
    else {
      const dateString = formatDate(new Date(year, month, dayNumber))

      const dayEvents = events.value
        .filter(e => e.date === dateString)
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))

      days.push({
        empty: false,
        date: dateString,
        day: dayNumber,
        events: dayEvents,
      })
    }
  }

  return {
    monthName,
    year,
    days,
  }
}

const startYear = ref(2026)
const startMonth = ref(4)

const monthCount = 2

const months = computed(() => {
  const base = new Date(startYear.value, startMonth.value, 1)

  return Array.from({ length: monthCount }, (_, i) =>
    createMonthData(base, i))
})
</script>

<template>
  <div class="document">
    <section class="crud">
      <h2>
        {{ isEditing ? 'Termin bearbeiten' : 'Termin hinzufügen' }}
      </h2>

      <div class="form">
        <input
          v-model="form.title"
          type="text"
          placeholder="Titel"
        >

        <input
          v-model="form.date"
          type="date"
        >

        <input
          v-model="form.time"
          type="time"
        >

        <div class="buttons">
          <button
            v-if="!isEditing"
            @click="addEvent"
          >
            Hinzufügen
          </button>

          <template v-else>
            <button @click="updateEvent">
              Aktualisieren
            </button>

            <button @click="deleteEvent">
              Löschen
            </button>

            <button @click="resetForm">
              Abbrechen
            </button>
          </template>
        </div>
      </div>
    </section>

    <section class="title-page page">
      <h1>Gemeindetermine</h1>

      <p>
        {{ months[0]?.monthName }} {{ months[0]?.year }}
        —
        {{ months[1]?.monthName }} {{ months[1]?.year }}
      </p>
    </section>

    <section
      v-for="(month, index) in months"
      :key="index"
      class="calendar page"
    >
      <div class="header">
        <div />

        <div class="monthday">
          Die Termine im
          <h2>{{ month.monthName }} {{ month.year }}</h2>
        </div>
      </div>

      <div class="container">
        <div class="weekdays">
          <div
            v-for="day in weekdays"
            :key="day"
            class="weekday"
          >
            {{ day }}
          </div>
        </div>

        <div class="days">
          <div
            v-for="day in month.days"
            :key="day.date"
            class="day"
            :class="{ empty: day.empty }"
          >
            <div class="day-number">
              {{ day.day }}
            </div>

            <div class="events">
              <div
                v-for="event in day.events"
                :key="event.id"
                class="event"
                @click="selectEvent(event)"
              >
                <span class="event-title">
                  <span
                    v-if="event.time"
                    class="event-time"
                  >
                    {{ event.time }}
                  </span>

                  {{ event.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
</style>
