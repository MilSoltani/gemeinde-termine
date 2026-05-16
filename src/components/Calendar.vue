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

<style scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-container);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-inline: 5px 15px;
}

.monthday {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px 2px;
  border: 1px solid var(--color-border-light);
  border-bottom: 0;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  background: var(--color-monthday);
  color: var(--color-text);
}

.monthday h2 {
  margin: 0;
  font-size: var(--font-size-month);
  font-weight: 600;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  height: var(--weekday-height);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  background: var(--color-header);
  color: var(--color-text-inverse);
}

.weekday {
  display: flex;
  align-items: center;
  padding-left: 10px;
  border-right: 1px dashed var(--color-border);
  font-size: var(--font-size-weekday);
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.weekday:last-child {
  border-right: none;
}

.days {
  flex: 1;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(var(--day-min-height), auto);
  border-top: 1px dashed var(--color-border);
  border-left: 1px dashed var(--color-border);
}

.day {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-day);
  box-sizing: border-box;
  border: 1px dashed var(--color-border);
  background: var(--color-surface-muted);
}

.day.empty {
  background: var(--color-surface-empty);
}

.day-number {
  margin-bottom: -5px;

  color: var(--color-text);

  font-size: var(--font-size-day);
  font-weight: 500;
  text-align: right;
}

.events {
  display: flex;
  flex-direction: column;
}

.event {
  display: flex;
  flex-wrap: wrap;
  column-gap: 3px;
  cursor: pointer;
  margin: 1mm 0;
  border-radius: var(--radius-sm);
  line-height: var(--line-height-event);
  white-space: normal;
  word-break: break-word;
}

.event-time {
  flex-shrink: 0;
  margin-right: 3px;
  padding: 1px 3px 2px;
  border-radius: var(--radius-sm);
  background: var(--color-event-time);
  color: var(--color-text-inverse);
  font-size: var(--font-size-event-time);
  font-weight: 600;
  opacity: 0.9;
}

.event-title {
  flex: 1;

  font-size: var(--font-size-event);
}

.event-marker {
  flex-shrink: 0;
  margin-left: 2px;
  padding: 0 2px;
  font-size: var(--font-size-event-time);
  font-weight: 700;
  color: var(--color-text);
}

@media print {
  .calendar,
  .title-page {
    box-shadow: none;
  }
}
</style>
