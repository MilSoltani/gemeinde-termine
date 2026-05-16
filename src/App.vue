<script setup lang="ts">
import Calendar from './components/Calendar.vue'
import Forms from './components/Forms.vue'
import HelpDialog from './components/HelpDialog.vue'
import { useCalendarStore } from './stores/useCalendarStore'

const calendarStore = useCalendarStore()

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

      <Calendar :month="month" />

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
