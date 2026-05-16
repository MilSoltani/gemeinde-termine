import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useEventsStore } from './useEventsStore'

const MONTH_STORAGE_KEY = 'calendar-selected-month'

export const useCalendarStore = defineStore('calendar', () => {
  const eventsStore = useEventsStore()
  const selectedMonth = ref(
    localStorage.getItem(MONTH_STORAGE_KEY) || '2026-05',
  )

  watch(selectedMonth, (value) => {
    localStorage.setItem(MONTH_STORAGE_KEY, value)
  })

  const startYear = computed(() => {
    return Number(selectedMonth.value.split('-')[0])
  })

  const startMonth = computed(() => {
    return Number(selectedMonth.value.split('-')[1]) - 1
  })

  const monthCount = 2

  function formatDate(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  function getNotesForMonth(year: number, month: number) {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    const monthEvents = eventsStore.events.filter(e => e.date.startsWith(monthStr))

    const uniqueNotes: Map<string, number> = new Map()

    monthEvents.forEach((event) => {
      if (event.notes && !uniqueNotes.has(event.notes)) {
        uniqueNotes.set(event.notes, uniqueNotes.size)
      }
    })

    return Array.from(uniqueNotes.keys())
  }

  function createMonthData(baseDate: Date, offset: number) {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth() + offset, 1)

    const year = date.getFullYear()
    const month = date.getMonth()

    const monthName = date.toLocaleString('de-DE', { month: 'long' })

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay()

    const totalCells = 42

    const days: any[] = []

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startDay + 1

      if (dayNumber < 1 || dayNumber > daysInMonth) {
        days.push({
          empty: true,
          date: `empty-${offset}-${i}`,
          day: '',
          events: [],
        })
      }
      else {
        const dateString = formatDate(new Date(year, month, dayNumber))

        const dayEvents = eventsStore.events
          .filter(e => e.date === dateString)
          .sort((a, b) => (a.time || '').localeCompare(b.time || ''))

        days.push({
          empty: false,
          date: dateString,
          day: dayNumber,
          events: dayEvents,
        })
      }
    }

    return {
      monthName,
      year,
      month,
      days,
      notes: getNotesForMonth(year, month),
    }
  }

  const months = computed(() => {
    const base = new Date(startYear.value, startMonth.value, 1)

    return Array.from({ length: monthCount }, (_, i) =>
      createMonthData(base, i))
  })

  return {
    selectedMonth,
    startYear,
    startMonth,
    monthCount,
    months,
  }
})
