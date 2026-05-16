export interface EventItem {
  id: number
  title: string
  date: string
  time: string
  notes?: string
}

export interface Month {
  monthName: string
  year: number
  month: number
  days: any[]
  notes: string[]
}
