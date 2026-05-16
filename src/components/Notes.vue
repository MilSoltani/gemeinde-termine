<script setup lang="ts">
import type { Month } from '@/types'

interface Props {
  month: Month
}

const props = defineProps<Props>()

function getStarMarker(noteIndex: number): string {
  return '*'.repeat(noteIndex + 1)
}
</script>

<template>
  <div
    v-if="props.month.notes.length > 0"
    class="notes-section"
  >
    <div class="notes-list">
      <div
        v-for="(note, index2) in props.month.notes"
        :key="index2"
        class="note-item"
      >
        <span class="note-marker">{{ getStarMarker(index2) }}</span>
        <span class="note-text">{{ note }}</span>
      </div>
    </div>
  </div>
</template>
