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

<style scoped>
.notes-section {
  font-size: 11px;
  padding: 5px 5px 0 5px;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.note-item {
  display: flex;
  gap: 8px;

  font-size: 12px;
  line-height: 1.4;
}

.note-marker {
  flex-shrink: 0;

  font-weight: 700;
  font-size: 12px;

  color: var(--color-text);
}

.note-text {
  flex: 1;

  word-break: break-word;
  white-space: normal;
}
</style>
