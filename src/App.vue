<script setup lang="ts">
import Forms from './components/Forms.vue'
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
</script>

<template>
  <div class="document">
    <Forms />

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
