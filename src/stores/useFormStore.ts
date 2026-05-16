import type { EventItem } from '../types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useEventsStore } from './useEventsStore'

export const useFormStore = defineStore('form', () => {
  const eventsStore = useEventsStore()

  const form = ref({
    id: null as number | null,
    title: '',
    date: '',
    time: '',
    notes: '',
  })

  const isEditing = computed(() => form.value.id !== null)
  const canSubmit = computed(() => {
    return !!form.value.title
      && !!form.value.date
      && !!form.value.time
  })

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

  return {
    form,
    isEditing,
    deleteMonth,
    resetForm,
    addEvent,
    selectEvent,
    updateEvent,
    deleteEvent,
    removeMonthEvents,
    canSubmit,
  }
})
