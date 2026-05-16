<script setup lang="ts">
import type { EventItem } from './types'
import { computed, ref } from 'vue'
import HelpDialog from './components/HelpDialog.vue'
import { useCalendarStore } from './stores/useCalendarStore'
import { useEventsStore } from './stores/useEventsStore'

const eventsStore = useEventsStore()
const calendarStore = useCalendarStore()

const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

const form = ref({
  id: null as number | null,
  title: '',
  date: '',
  time: '',
  notes: '',
})

const isEditing = computed(() => form.value.id !== null)

const deleteMonth = ref('')

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

  eventsStore.createEventFromForm(form.value)

  resetForm()
}

function selectEvent(event: EventItem) {
  form.value = { ...event, notes: event.notes || '' }
}

function updateEvent() {
  if (form.value.id === null)
    return

  eventsStore.updateEvent({
    id: form.value.id,
    title: form.value.title,
    date: form.value.date,
    time: form.value.time,
    notes: form.value.notes,
  })

  resetForm()
}

function deleteEvent() {
  if (form.value.id === null)
    return

  eventsStore.deleteEvent(form.value.id)

  resetForm()
}

function removeMonthEvents() {
  if (!deleteMonth.value)
    return

  eventsStore.removeMonthEvents(deleteMonth.value)

  deleteMonth.value = ''
}

function getStarMarker(noteIndex: number): string {
  return '*'.repeat(noteIndex + 1)
}

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
            v-model="calendarStore.selectedMonth"
            type="month"
          >

          <p class="selected-months">
            {{
              new Date(calendarStore.startYear, calendarStore.startMonth)
                .toLocaleString('de-DE', {
                  month: 'long',
                  year: 'numeric',
                })
            }}
            —
            {{
              new Date(calendarStore.startYear, calendarStore.startMonth + 1)
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
      v-for="(month, index) in calendarStore.months"
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
                    v-if="eventsStore.getEventNoteMarker(event.notes, month.year, month.month)"
                    class="event-marker"
                  >
                    {{ eventsStore.getEventNoteMarker(event.notes, month.year, month.month) }}
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
