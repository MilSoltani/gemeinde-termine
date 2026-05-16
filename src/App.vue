<script setup lang="ts">
import HelpDialog from './components/HelpDialog.vue'
import { useCalendarStore } from './stores/useCalendarStore'
import { useEventsStore } from './stores/useEventsStore'
import { useFormStore } from './stores/useFormStore'

const eventsStore = useEventsStore()
const calendarStore = useCalendarStore()
const formStore = useFormStore()

const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

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
          {{ formStore.isEditing ? 'Termin bearbeiten' : 'Termine hinzufügen' }}:
        </h4>

        <div class="form">
          <input
            v-model="formStore.form.title"
            type="text"
            placeholder="Titel"
          >

          <input
            v-model="formStore.form.date"
            type="date"
          >

          <input
            v-model="formStore.form.time"
            type="time"
          >

          <textarea
            v-model="formStore.form.notes"
            placeholder="Notizen (optional)"
            rows="3"
          />

          <div class="buttons">
            <button
              v-if="!formStore.isEditing"
              @click="formStore.addEvent"
            >
              Hinzufügen
            </button>

            <template v-else>
              <button @click="formStore.updateEvent">
                Aktualisieren
              </button>

              <button @click="formStore.deleteEvent">
                Löschen
              </button>

              <button @click="formStore.resetForm">
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
            v-model="formStore.deleteMonth"
            type="month"
          >

          <button @click="formStore.removeMonthEvents">
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
                @click="formStore.selectEvent(event)"
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
