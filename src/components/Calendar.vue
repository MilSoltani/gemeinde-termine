<script setup lang="ts">
import type { Month } from '@/types'
import { useEventsStore } from '@/stores/useEventsStore'
import { useFormStore } from '@/stores/useFormStore'

interface Props {
  month: Month
}

const props = defineProps<Props>()
const eventsStore = useEventsStore()
const formStore = useFormStore()

const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
</script>

<template>
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
        v-for="day in props.month.days"
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
                v-if="eventsStore.getEventNoteMarker(event.notes, props.month.year, props.month.month)"
                class="event-marker"
              >
                {{ eventsStore.getEventNoteMarker(event.notes, props.month.year, props.month.month) }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
