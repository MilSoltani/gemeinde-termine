import type { EventItem } from '../types'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const EVENTS_STORAGE_KEY = 'calendar-events'

export const useEventsStore = defineStore('events', () => {
  const events = ref<EventItem[]>(loadEvents())

  function loadEvents(): EventItem[] {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY)

    if (!raw)
      return []

    try {
      return JSON.parse(raw)
    }
    catch {
      return []
    }
  }

  watch(
    events,
    (value) => {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  function addEvent(event: EventItem) {
    events.value.push(event)
  }

  function updateEvent(updatedEvent: EventItem) {
    const index = events.value.findIndex(e => e.id === updatedEvent.id)
    if (index !== -1) {
      events.value[index] = updatedEvent
    }
  }

  function deleteEvent(eventId: number) {
    events.value = events.value.filter(e => e.id !== eventId)
  }

  function removeMonthEvents(monthStr: string) {
    events.value = events.value.filter(
      event => !event.date.startsWith(monthStr),
    )
  }

  function createEventFromForm(formData: { title: string, date: string, time: string, notes: string }) {
    const newEvent: EventItem = {
      id: Date.now(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
    }
    addEvent(newEvent)
  }

  function getNotesForMonth(year: number, month: number) {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    const monthEvents = events.value.filter(e => e.date.startsWith(monthStr))

    const uniqueNotes: Map<string, number> = new Map()

    monthEvents.forEach((event) => {
      if (event.notes && !uniqueNotes.has(event.notes)) {
        uniqueNotes.set(event.notes, uniqueNotes.size)
      }
    })

    return Array.from(uniqueNotes.keys())
  }

  function getEventNoteMarker(eventNotes: string | undefined, year: number, month: number): string {
    if (!eventNotes)
      return ''

    const notes = getNotesForMonth(year, month)
    const index = notes.indexOf(eventNotes)

    return index >= 0 ? '*'.repeat(index + 1) : ''
  }

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    removeMonthEvents,
    createEventFromForm,
    getNotesForMonth,
    getEventNoteMarker,
  }
})
