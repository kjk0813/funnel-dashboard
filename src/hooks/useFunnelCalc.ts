import { MONTHLY, AVG_FEE } from '../data/monthly'
import type { MonthlyRecord } from '../data/monthly'

export type Overrides = Partial<MonthlyRecord>

export type FunnelVols = {
  ad: number
  sem: number
  is: number
  appt: number
  first: number
  prop: number
  close: number
  upsell: number
}

function merged(monthIndex: number, overrides: Overrides): MonthlyRecord {
  return { ...MONTHLY[monthIndex], ...overrides }
}

export function calcVols(monthIndex: number, overrides: Overrides = {}): FunnelVols {
  const d = merged(monthIndex, overrides)

  const ad = d.ad
  const sem = Math.round(ad * (d.sem_y / 100))
  const is_ = Math.round(sem * (d.is_y / 100))
  const appt = Math.round(is_ * (d.appt_y / 100))
  const first = Math.round(appt * (d.first_y / 100))
  const prop = Math.round(first * (d.prop_y / 100))
  const close = Math.round(prop * (d.close_y / 100))
  const upsell = Math.round(close * (d.up_y / 100))

  return { ad, sem, is: is_, appt, first, prop, close, upsell }
}

export function calcClose(monthIndex: number, overrides: Overrides = {}): number {
  return calcVols(monthIndex, overrides).close
}

export function calcRevenue(closeCount: number, avgFee: number = AVG_FEE): number {
  return closeCount * avgFee
}

export function useFunnelCalc(monthIndex: number, overrides: Overrides = {}) {
  const vols = calcVols(monthIndex, overrides)
  const closeCount = vols.close
  const revenue = calcRevenue(closeCount)

  return { vols, closeCount, revenue }
}
