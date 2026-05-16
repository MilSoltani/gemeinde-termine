<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import HelpDialog from './components/HelpDialog.vue'

interface EventItem {
  id: number
  title: string
  date: string
  time: string
  notes?: string
}

const EVENTS_STORAGE_KEY = 'calendar-events'
const events = ref<EventItem[]>(loadEvents())

function loadEvents(): EventItem[] {
  const raw = localStorage.getItem(EVENTS_STORAGE_KEY)

  if (!raw)
    return []

  try {
    return JSON.parse(raw)
  }
  catch {
    return []
  }
}

watch(
  events,
  (value) => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

const deleteMonth = ref('')

function removeMonthEvents() {
  if (!deleteMonth.value)
    return

  events.value = events.value.filter(
    event => !event.date.startsWith(deleteMonth.value),
  )

  deleteMonth.value = ''
}

const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

const form = ref({
  id: null as number | null,
  title: '',
  date: '',
  time: '',
  notes: '',
})

const isEditing = computed(() => form.value.id !== null)

function resetForm() {
  form.value = {
    id: null,
    title: '',
    date: '',
    time: '',
    notes: '',
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
    notes: form.value.notes,
  }

  events.value.push(newEvent)

  resetForm()
}

function selectEvent(event: EventItem) {
  form.value = { ...event, notes: event.notes || '' }
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
    notes: form.value.notes,
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

function getNotesForMonth(year: number, month: number) {
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthEvents = events.value.filter(e => e.date.startsWith(monthStr))

  const uniqueNotes: Map<string, number> = new Map()

  monthEvents.forEach((event, index) => {
    if (event.notes && !uniqueNotes.has(event.notes)) {
      uniqueNotes.set(event.notes, index)
    }
  })

  return Array.from(uniqueNotes.keys())
}

function getStarMarker(noteIndex: number): string {
  return '*'.repeat(noteIndex + 1)
}

function getEventNoteMarker(eventNotes: string | undefined, year: number, month: number): string {
  if (!eventNotes)
    return ''

  const notes = getNotesForMonth(year, month)
  const index = notes.indexOf(eventNotes)

  return index >= 0 ? getStarMarker(index) : ''
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
    month,
    days,
    notes: getNotesForMonth(year, month),
  }
}

const MONTH_STORAGE_KEY = 'calendar-selected-month'
const selectedMonth = ref(
  localStorage.getItem(MONTH_STORAGE_KEY) || '2026-05',
)
watch(selectedMonth, (value) => {
  localStorage.setItem(MONTH_STORAGE_KEY, value)
})

const startYear = computed(() => {
  return Number(selectedMonth.value.split('-')[0])
})

const startMonth = computed(() => {
  return Number(selectedMonth.value.split('-')[1]) - 1
})

const monthCount = 2

const months = computed(() => {
  const base = new Date(startYear.value, startMonth.value, 1)

  return Array.from({ length: monthCount }, (_, i) =>
    createMonthData(base, i))
})

function printCalendar() {
  window.print()
}
</script>

<template>
  <div class="document">
    <section class="crud">
      <div class="crud-column">
        <h4>Anfangsmonat auswählen:</h4>

        <div class="form">
          <input
            v-model="selectedMonth"
            type="month"
          >

          <p class="selected-months">
            {{
              new Date(startYear, startMonth)
                .toLocaleString('de-DE', {
                  month: 'long',
                  year: 'numeric',
                })
            }}
            —
            {{
              new Date(startYear, startMonth + 1)
                .toLocaleString('de-DE', {
                  month: 'long',
                  year: 'numeric',
                })
            }}
          </p>

          <button @click="printCalendar">
            Drucken / PDF speichern
          </button>
        </div>
      </div>

      <div class="crud-column">
        <h4>
          {{ isEditing ? 'Termin bearbeiten' : 'Termine hinzufügen' }}:
        </h4>

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

          <textarea
            v-model="form.notes"
            placeholder="Notizen (optional)"
            rows="3"
          />

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
      </div>

      <div class="crud-column">
        <h4>Monatstermine löschen</h4>

        <div class="form">
          <input
            v-model="deleteMonth"
            type="month"
          >

          <button @click="removeMonthEvents">
            Alle Termine des Monats löschen
          </button>
        </div>
      </div>
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

                  <span
                    v-if="getEventNoteMarker(event.notes, month.year, month.month)"
                    class="event-marker"
                  >
                    {{ getEventNoteMarker(event.notes, month.year, month.month) }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="month.notes.length > 0"
        class="notes-section"
      >
        <div class="notes-list">
          <div
            v-for="(note, index2) in month.notes"
            :key="index2"
            class="note-item"
          >
            <span class="note-marker">{{ getStarMarker(index2) }}</span>
            <span class="note-text">{{ note }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>

  <HelpDialog />
</template>

<style scoped>
</style>
