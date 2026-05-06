export type MonthlyRecord = {
  ad: number
  sem_y: number
  is_y: number
  appt_y: number
  first_y: number
  prop_y: number
  close_y: number
  up_y: number
}

export const MONTHLY: MonthlyRecord[] = [
  // 9月
  { ad: 95000, sem_y: 2.4, is_y: 51.2, appt_y: 82.8, first_y: 60.2, prop_y: 68.4, close_y: 65.8, up_y: 26.2 },
  // 10月
  { ad: 102000, sem_y: 2.3, is_y: 49.8, appt_y: 81.4, first_y: 58.8, prop_y: 66.2, close_y: 64.4, up_y: 25.8 },
  // 11月
  { ad: 108000, sem_y: 2.1, is_y: 47.4, appt_y: 80.2, first_y: 57.2, prop_y: 64.8, close_y: 63.2, up_y: 27.4 },
  // 12月
  { ad: 118000, sem_y: 1.8, is_y: 43.6, appt_y: 79.4, first_y: 55.8, prop_y: 63.2, close_y: 61.4, up_y: 24.8 },
]

export const MONTH_LABELS = ['9月', '10月', '11月', '12月']

export const AVG_FEE = 92000
