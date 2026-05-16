<script setup lang="ts">
import { useCalendarStore } from '@/stores/useCalendarStore'
import { useFormStore } from '@/stores/useFormStore'

const calendarStore = useCalendarStore()
const formStore = useFormStore()

function printCalendar() {
  window.print()
}
</script>

<template>
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
</template>

<style scoped>
.crud {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.crud-column {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

input,
textarea,
button {
  font-family: inherit;
}

textarea {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  resize: vertical;
}
@media print {
  .crud {
    display: none !important;
  }
}
</style>
