import { useState, useRef, useEffect } from 'react'
import { PHASES } from './data/phases'
import { MONTHLY, MONTH_LABELS, AVG_FEE } from './data/monthly'
import { EXTERNAL_FACTORS, IMPACT_MATRIX } from './data/external'
import type { PhaseImpact } from './data/external'
import { calcVols, calcRevenue } from './hooks/useFunnelCalc'
import type { Overrides } from './hooks/useFunnelCalc'
import type { MonthlyRecord } from './data/monthly'
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

const G = '#1D9E75'
const Y = '#EF9F27'
const R = '#E24B4A'
type Tab = 'funnel' | 'phase' | 'sim' | 'ext' | 'ai'
const TABS: { id: Tab; label: string }[] = [
  { id: 'funnel', label: 'ファネル全体' },
  { id: 'phase', label: 'フェーズ詳細' },
  { id: 'sim', label: '改善シミュ' },
  { id: 'ext', label: '外部要因' },
  { id: 'ai', label: 'AI分析' },
]

function fmtN(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  return n.toLocaleString('ja-JP')
}
function fmtY(n: number) {
  if (n >= 1e8) return `¥${(n / 1e8).toFixed(2)}億`
  if (n >= 1e6) return `¥${(n / 1e6).toFixed(1)}M`
  if (n >= 1e4) return `¥${Math.round(n / 1e4)}万`
  return `¥${n.toLocaleString('ja-JP')}`
}
function yc(actual: number, target: number) {
  if (actual >= target) return G
  if (actual >= target * 0.85) return Y
  return R
}
function ycTag(actual: number, target: number) {
  if (actual >= target) return 'bg-emerald-100 text-emerald-700'
  if (actual >= target * 0.85) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}
function impactStyle(imp: PhaseImpact) {
  const isP = imp[0] === '+'
  const isN = imp[0] === '-'
  const lv = imp.replace(/[+-]/g, '')
  const bg = isP
    ? lv === 'h' ? 'rgba(29,158,117,.18)' : lv === 'm' ? 'rgba(29,158,117,.09)' : 'rgba(29,158,117,.04)'
    : isN
    ? lv === 'h' ? 'rgba(226,75,74,.18)' : lv === 'm' ? 'rgba(226,75,74,.09)' : 'rgba(226,75,74,.04)'
    : 'transparent'
  const color = isP ? '#0F6E56' : isN ? '#A32D2D' : '#888'
  const label = isP
    ? `↑${lv === 'h' ? '大' : lv === 'm' ? '中' : '小'}`
    : isN
    ? `↓${lv === 'h' ? '大' : lv === 'm' ? '中' : '小'}`
    : '–'
  return { bg, color, label }
}

<<<<<<< HEAD
// ─── CSV パーサー ─────────────────────────────────────────
function parseCSV(text: string): { data: MonthlyRecord[]; labels: string[] } | null {
  // BOM・改行コード正規化
=======
function parseCSV(text: string): { data: MonthlyRecord[]; labels: string[] } | null {
>>>>>>> 08ebe50500ae1b90f99d95b12b75481da2b6c8a7
  const clean = text.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = clean.trim().split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return null

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const col = (name: string) => headers.indexOf(name)

  const monthCol = col('month') >= 0 ? col('month') : 0
  const adCol = col('ad')
  const semCol = col('sem_y')
  const isCol = col('is_y')
  const apptCol = col('appt_y')
  const firstCol = col('first_y')
  const propCol = col('prop_y')
  const closeCol = col('close_y')
  const upCol = col('up_y')

  if ([adCol, semCol, isCol, apptCol, firstCol, propCol, closeCol, upCol].some(i => i < 0)) {
    return null
  }

  const data: MonthlyRecord[] = []
  const labels: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim())
    labels.push(cols[monthCol] || `${i}月`)
    data.push({
      ad: parseFloat(cols[adCol]) || 0,
      sem_y: parseFloat(cols[semCol]) || 0,
      is_y: parseFloat(cols[isCol]) || 0,
      appt_y: parseFloat(cols[apptCol]) || 0,
      first_y: parseFloat(cols[firstCol]) || 0,
      prop_y: parseFloat(cols[propCol]) || 0,
      close_y: parseFloat(cols[closeCol]) || 0,
      up_y: parseFloat(cols[upCol]) || 0,
    })
  }

  return { data, labels }
}

<<<<<<< HEAD
// ─── CSVテンプレート生成 ──────────────────────────────────
=======
>>>>>>> 08ebe50500ae1b90f99d95b12b75481da2b6c8a7
function downloadTemplate() {
  const header = 'month,ad,sem_y,is_y,appt_y,first_y,prop_y,close_y,up_y'
  const rows = MONTHLY.map((d, i) =>
    `${MONTH_LABELS[i]},${d.ad},${d.sem_y},${d.is_y},${d.appt_y},${d.first_y},${d.prop_y},${d.close_y},${d.up_y}`
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'funnel_template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

<<<<<<< HEAD
// ─── AI KB ───────────────────────────────────────────────
=======
>>>>>>> 08ebe50500ae1b90f99d95b12b75481da2b6c8a7
type Msg = { role: 'user' | 'ai'; text: string }
const KB: Record<string, string> = {
  is_drop:
    `**IS対応 → アポ獲得率 43.6%（目標88%）の要因分析**\n\n` +
    `計算式: アポ獲得数 ÷ IS対応件数 × 100\n9月51.2% → 10月49.8% → 11月47.4% → 12月43.6%（4ヶ月連続悪化）\n\n` +
    `**悪化している説明変数（影響大→小）:**\n` +
    `🔴 初回コールスピード: セミナー後平均51時間（目標4時間以内）\n` +
    `🔴 BANTヒアリング完了率: 41%（目標75%）\n` +
    `🔴 担当者間アポ獲得率ギャップ: 最大31pt差\n` +
    `🟡 コール試行回数: 平1.7回（目標3回×3日ルール）\n\n` +
    `**外部要因**: 競合の無料プラン拡大でセミナー参加者の比較検討期間が長期化。\n\n` +
    `**即効施策**: セミナー終了後4時間以内コールSLAの設定（コストゼロで最大インパクト）。これだけでも月次+¥180万の改善余地あり。`,
  impact:
    `**フェーズ別 歩留まり+1pt の月次売上インパクト**\n\n` +
    `1. 🔴 **成約→追加購入（継続率）**: +¥324万/pt ← 最大\n` +
    `2. 🔴 **提案→成約**: +¥204万/pt\n` +
    `3. 🟡 **初回商談→提案**: +¥118万/pt\n` +
    `4. 🟡 **アポ→初回商談**: +¥78万/pt\n` +
    `5. 🟡 **IS対応→アポ**: +¥52万/pt\n` +
    `6. 🟢 **セミナー→IS対応**: +¥28万/pt\n` +
    `7. 🟢 **広告→セミナー申込**: +¥9.5万/pt\n\n` +
    `**示唠**: 後フェーズほど 1ptのインパクトが大きい。現在のボトルネックはIS対応とアポ→初回商談に集中。`,
  seminar_is:
    `**セミナー→IS引き渡しのボトルネック分析**\n\n` +
    `セミナー→IS対応移行率: 43.6%（目標58%）\n\n` +
    `**2段階の問題がある:**\n\n` +
    `① セミナー申込→実際の出席率1.2%（目標82%）\n` +
    `② セミナー参加→IS引き渡しスピード51時間（目標4時間以内）\n\n` +
    `**温度感が冷める構造**: セミナー参加直後が最も点理が高い。\n\n` +
    `**具体的な改善策**:\n` +
    `✓ セミナー終了と同時にISへSlack通知（自動化可能）\n` +
    `✓ ISのシフトをセミナー終了時間に合わせて調整\n` +
    `✓ アンケート結果をCRMに自動連携（BANT情報の事前取得）`,
  ext:
    `**外部要因でファネルに最も影響しているのは？**\n\n` +
    `**影響強度ランキング**:\n` +
    `1. 広告CPC相場（強度92%・逆風）\n` +
    `2. 市場マインド（強度86%・追い風）\n` +
    `3. 季節性（強度84%・追い風）\n` +
    `4. 競合動向（強度78%・逆風）\n\n` +
    `**戦略的示唠**: 外部逆風（CPC・競合）はコントロール不可。今の追い風（季節性・市場）を最大活用するために、内部施策（ISスピード・商談品質）を今月中に集中実施。`,
  priority:
    `**今月の最優先施策 TOP3（12月データ時点）**\n\n` +
    `🔴 **即時（今週中・コストゼロ）:**\n` +
    `① セミナー後4時間以内コールのSLA化\n` +
    `② アポリマインドSMS設定\n\n` +
    `🟡 **今月中（中期施策）:**\n` +
    `④ ISワークスクリプト（BANT）標準化\n\n` +
    `**月次成約 143件 → 目標値適用後: 推定270件超**`,
  default:
    `**ファネル全体の現状（12月ダミーデータ時点）**\n\n` +
    `📣 広告→セミナー申込: 1.8%（目標2.8%）\n` +
    `🤝 セミナー→IS対応: 43.6%（目標58%）\n` +
    `📞 IS→アポ: 79.4%（目標88%）\n` +
    `📅 アポ→初回商談: 55.8%（目標72%）\n` +
    `💻 初回商談→提案: 63.2%（目標74%）\n` +
    `📄 提案→成約: 61.4%（目標74%）\n` +
    `✅ 成約→追加購入: 24.8%（目標38%）`,
}
function getReply(q: string): string {
  const l = q.toLowerCase()
  if (l.includes('is対応') || l.includes('アポ獲得') || l.includes('コール') || l.includes('is→')) return KB.is_drop
  if (l.includes('インパクト') || l.includes('最大') || l.includes('どのフェーズ')) return KB.impact
  if (l.includes('セミナー') && (l.includes('引き渡し') || l.includes('ボトルネック') || l.includes('is'))) return KB.seminar_is
  if (l.includes('外部') || l.includes('競合') || l.includes('影響')) return KB.ext
  if (l.includes('優先') || l.includes('施策') || l.includes('アクション') || l.includes('今月') || l.includes('top')) return KB.priority
  return KB.default
}

<<<<<<< HEAD
// ─── ファネルタブ ─────────────────────────────────────────
=======
>>>>>>> 08ebe50500ae1b90f99d95b12b75481da2b6c8a7
function FunnelTab({
  monthIndex,
  onPhaseClick,
  monthlyData,
  monthLabels,
}: {
  monthIndex: number
  onPhaseClick: (id: string) => void
  monthlyData: MonthlyRecord[]
  monthLabels: string[]
}) {
  const [trendPhase, setTrendPhase] = useState('is')
  const mi = monthIndex
  const mi1 = Math.max(0, mi - 1)
  const vols = calcVols(monthlyData, mi)
  const volArray = [vols.ad, vols.sem, vols.is, vols.appt, vols.first, vols.prop, vols.close, vols.upsell]
  const maxVol = Math.max(...volArray.filter(Boolean) as number[])
  const close = vols.close
  const close1 = calcVols(monthlyData, mi1).close
  const rev = calcRevenue(close)
  const cac = Math.round(monthlyData[mi].ad * 120 / close)
  const cvrAll = (close / monthlyData[mi].ad * 100).toFixed(3)

  const kpis = [
    { label: '月次成約件数', value: `${close}件`, sub: `前月比 ${close >= close1 ? '+' : ''}${close - close1}件`, good: close >= close1 },
    { label: '月次売上（推定）', value: fmtY(rev), sub: `平均手数料 ¥${fmtN(AVG_FEE)}/件`, good: true },
    { label: '全体CVR（広告→成約）', value: `${cvrAll}%`, sub: '目標 0.18%', good: parseFloat(cvrAll) >= 0.15 },
    { label: 'CAC（推定）', value: fmtY(cac), sub: '目標 ¥38万', good: cac <= 380000 },
  ]

  const tp = PHASES.find(p => p.id === trendPhase)!
  const trendData = monthlyData.map((d, i) => ({
    month: monthLabels[i],
    value: tp.yieldKey ? d[tp.yieldKey as keyof MonthlyRecord] as number : 0,
  }))

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {kpis.map(k => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">{k.label}</p>
            <p className="text-lg font-medium text-gray-900">{k.value}</p>
            <p className="text-xs mt-1" style={{ color: k.good ? G : R }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs font-medium text-gray-500 tracking-wide uppercase">8フェーズ貢献ファネル</p>
            <p className="text-xs text-gray-400">上段: ボリューム　下段: 次フェーズへの歩留まり率（括弧=目標）　色=進捗状況</p>
          </div>
          <div className="flex gap-3 flex-wrap text-xs text-gray-500">
            {[['#185FA5','マーケ'],['#1D9E75','IS'],['#EF9F27','FS'],['#8B5CF6','CS']].map(([c,l]) => (
              <span key={l} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: c }} />{l}
              </span>
            ))}
          </div>
        </div>
        <div>
          {PHASES.map((p, i) => {
            const vol = volArray[i]
            const yieldVal = p.yieldKey ? monthlyData[mi][p.yieldKey as keyof MonthlyRecord] as number : null
            const prevYieldVal = p.yieldKey ? monthlyData[mi1][p.yieldKey as keyof MonthlyRecord] as number : null
            const target = p.yieldTarget
            const hasY = yieldVal !== null && target !== null
            const barW = vol != null ? Math.round(vol / maxVol * 100) : 10
            const dy = hasY && prevYieldVal !== null ? yieldVal! - prevYieldVal : null
            const color = hasY ? yc(yieldVal!, target!) : '#aaa'
            const pct = hasY ? Math.min(yieldVal! / target! * 100, 100) : 0

            return (
              <div key={p.id} className="mb-3 cursor-pointer" onClick={() => onPhaseClick(p.id)}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{p.icon}</span>
                  <span className="text-xs font-medium text-gray-800 w-16 shrink-0">{p.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full text-white shrink-0" style={{ background: p.ownerColor }}>{p.owner}</span>
                  <span className="ml-auto text-xs text-gray-700 font-medium">{fmtN(vol ?? 0)} {p.volUnit}</span>
                  {hasY && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${ycTag(yieldVal!, target!)}`}>
                      {yieldVal!.toFixed(1)}%↓
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                    <div className="h-full rounded transition-all" style={{ width: `${barW}%`, background: p.ownerColor }} />
                  </div>
                  {hasY && (
                    <div className="w-44 shrink-0">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span style={{ color }} className="font-medium">歩留 {yieldVal!.toFixed(1)}%</span>
                        <span className="text-gray-400">目標 {target}%</span>
                      </div>
                      <div className="h-1 bg-gray-100 rounded">
                        <div className="h-full rounded" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      {dy !== null && (
                        <div className="text-xs mt-0.5" style={{ color: dy >= 0 ? G : R }}>
                          {dy >= 0 ? '▲' : '▼'}{Math.abs(dy).toFixed(1)}pt 前月比
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">歩留まり推移（月次）</p>
          <div className="flex gap-1 flex-wrap">
            {PHASES.filter(p => p.yieldKey).map(p => (
              <button
                key={p.id}
                onClick={() => setTrendPhase(p.id)}
                className={`text-xs px-2 py-0.5 rounded border transition-colors ${trendPhase === p.id ? 'text-white border-transparent' : 'text-gray-500 border-gray-200'}`}
                style={{ background: trendPhase === p.id ? p.ownerColor : undefined }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, '実績']} />
            {tp.yieldTarget && (
              <ReferenceLine y={tp.yieldTarget} stroke="#aaa" strokeDasharray="4 4"
                label={{ value: `目標 ${tp.yieldTarget}%`, position: 'right', fontSize: 10, fill: '#aaa' }}
              />
            )}
            <Line type="monotone" dataKey="value" stroke={tp.ownerColor} strokeWidth={2.5}
              dot={{ r: 4, fill: tp.ownerColor }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

<<<<<<< HEAD
// ─── フェーズ詳細タブ ────────────────────────────────────
=======
>>>>>>> 08ebe50500ae1b90f99d95b12b75481da2b6c8a7
function PhaseTab({
  monthIndex,
  initialPhase,
  monthlyData,
  monthLabels,
}: {
  monthIndex: number
  initialPhase: string
  monthlyData: MonthlyRecord[]
  monthLabels: string[]
}) {
  const [selected, setSelected] = useState(initialPhase)
  useEffect(() => setSelected(initialPhase), [initialPhase])

  const mi = monthIndex
  const mi1 = Math.max(0, mi - 1)
  const p = PHASES.find(x => x.id === selected)!
  const vols = calcVols(monthlyData, mi)
  const volArray = [vols.ad, vols.sem, vols.is, vols.appt, vols.first, vols.prop, vols.close, vols.upsell]
  const idx = PHASES.findIndex(x => x.id === selected)
  const vol = volArray[idx]
  const yieldVal = p.yieldKey ? monthlyData[mi][p.yieldKey as keyof MonthlyRecord] as number : null
  const prevYieldVal = p.yieldKey ? monthlyData[mi1][p.yieldKey as keyof MonthlyRecord] as number : null
  const target = p.yieldTarget
  const hasY = yieldVal !== null && target !== null
  const dy = hasY && prevYieldVal !== null ? yieldVal! - prevYieldVal : null
  const color = hasY ? yc(yieldVal!, target!) : '#aaa'
  const pct = hasY ? Math.min(Math.round(yieldVal! / target! * 100), 100) : 100

  return (
    <div>
      <div className="flex gap-1 flex-wrap mb-3">
        {PHASES.map(ph => (
          <button
            key={ph.id}
            onClick={() => setSelected(ph.id)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${selected === ph.id ? 'text-white border-transparent' : 'text-gray-500 border-gray-200'}`}
            style={{ background: selected === ph.id ? ph.ownerColor : undefined }}
          >
            {ph.icon} {ph.name}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-48">
            <p className="text-xs text-gray-400 mb-1">{p.icon} {p.name} → {p.owner} / {monthLabels[mi]}</p>
            <p className="text-2xl font-medium" style={{ color: p.ownerColor }}>
              {fmtN(vol ?? 0)}<span className="text-sm font-normal text-gray-400 ml-1">{p.volUnit}</span>
            </p>
            {hasY ? (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-1">{p.yieldLabel}</p>
                <p className="text-xs text-gray-300 mb-2 font-mono">{p.yieldFormula}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-medium" style={{ color }}>{yieldVal!.toFixed(1)}%</span>
                  {dy !== null && (
                    <span className="text-sm" style={{ color: dy >= 0 ? G : R }}>
                      {dy >= 0 ? '▲' : '▼'}{Math.abs(dy).toFixed(1)}pt
                    </span>
                  )}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${ycTag(yieldVal!, target!)}`}>
                    目標比 {pct}%
                  </span>
                </div>
                <div className="w-48 h-1 bg-gray-100 rounded mt-1.5">
                  <div className="h-full rounded" style={{ width: `${pct}%`, background: color }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">目標: {target}%</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-2">LTV最大化フェーズ</p>
            )}
          </div>
          {p.impactPerPt > 0 && (
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-right shrink-0">
              <p className="text-xs text-gray-400">歩留まり+1ptの売上インパクト</p>
              <p className="text-xl font-medium mt-0.5" style={{ color: p.ownerColor }}>{fmtY(p.impactPerPt)}/月</p>
              <p className="text-xs text-gray-400 mt-0.5">
                優先度: {p.impactPerPt >= 2000000 ? '🔴 高' : p.impactPerPt >= 800000 ? '🟡 中' : '🟢 低'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">歩留まりを下げている要因（説明変数）</p>
          <div className="space-y-2.5">
            {p.issues.map(iss => (
              <div key={iss.id} className="flex gap-2 pb-2.5 border-b border-gray-100 last:border-0 last:pb-0">
                <span className="shrink-0 mt-0.5">{iss.dir === 'bad' ? '🔴' : '🟢'}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium text-gray-800">{iss.label}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${iss.impact === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {iss.impact === 'high' ? '影響大' : '影響中'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{iss.currentValue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">改善施策</p>
          <p className="text-xs text-gray-400 mb-3">
            <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded font-medium">数↑</span> ボリュームを増やす &nbsp;
            <span className="bg-emerald-100 text-emerald-700 text-xs px-1.5 py-0.5 rounded font-medium">率↑</span> 歩留まりを上げる
          </p>
          <div className="space-y-2">
            {p.actions.map(a => (
              <div key={a.id} className="flex gap-2">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 h-fit ${a.type === 'vol' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {a.type === 'vol' ? '数↑' : '率↑'}
                </span>
                <p className="text-xs text-gray-700 leading-relaxed">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

<<<<<<< HEAD
// ─── 改善シミュタブ ──────────────────────────────────────
=======
>>>>>>> 08ebe50500ae1b90f99d95b12b75481da2b6c8a7
function SimTab({ monthIndex, monthlyData }: { monthIndex: number; monthlyData: MonthlyRecord[] }) {
  const [overrides, setOverrides] = useState<Overrides>({})
  const mi = monthIndex
  const base = calcVols(monthlyData, mi)
  const sim = calcVols(monthlyData, mi, overrides)
  const baseRev = calcRevenue(base.close)
  const simRev = calcRevenue(sim.close)
  const dr = simRev - baseRev
  const dc = sim.close - base.close
  const cvrBase = (base.close / monthlyData[mi].ad * 100).toFixed(3)
  const cvrSim = (sim.close / monthlyData[mi].ad * 100).toFixed(3)

  const sliders = PHASES.filter(p => p.yieldKey && p.yieldTarget)
  const applyTarget = () => {
    const o: Overrides = {}
    sliders.forEach(p => { (o as Record<string, number>)[p.yieldKey!] = p.yieldTarget! })
    setOverrides(o as Overrides)
  }
  const applyBest = () => {
    const o: Overrides = {}
    sliders.forEach(p => { (o as Record<string, number>)[p.yieldKey!] = Math.min(100, p.yieldTarget! * 1.05) })
    setOverrides(o as Overrides)
  }

  const impactData = PHASES.filter(p => p.impactPerPt > 0).map(p => ({
    name: `${p.icon} ${p.name}`,
    value: Math.round(p.impactPerPt / 10000),
    color: p.ownerColor,
  }))

  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">歩留まり改善シミュレーター</p>
        <p className="text-xs text-gray-400 mb-4">スライダーを動かすと成約件数・売上への影響をリアルタイム計算</p>
        <div className="space-y-4">
          {sliders.map(p => {
            const key = p.yieldKey as keyof MonthlyRecord
            const cur = monthlyData[mi][key] as number
            const sv = (overrides as Record<string, number>)[p.yieldKey!] ?? cur
            const min = Math.max(0, cur - 20).toFixed(1)
            const max = Math.min(100, p.yieldTarget! + 10).toFixed(1)
            const color = yc(sv, p.yieldTarget!)
            const diff = sv - cur
            return (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-20 shrink-0">
                  <p className="text-xs font-medium" style={{ color: p.ownerColor }}>{p.icon} {p.name}</p>
                  <p className="text-xs text-gray-400">目標 {p.yieldTarget}%</p>
                </div>
                <input
                  type="range" min={min} max={max} step="0.1" value={sv.toFixed(1)}
                  onChange={e => setOverrides(prev => ({ ...prev, [p.yieldKey!]: parseFloat(e.target.value) }))}
                  className="flex-1" style={{ accentColor: p.ownerColor }}
                />
                <div className="w-16 text-right shrink-0">
                  <p className="text-sm font-medium" style={{ color }}>{sv.toFixed(1)}%</p>
                  <p className="text-xs" style={{ color: diff >= 0 ? G : R }}>
                    {diff >= 0 ? '+' : ''}{diff.toFixed(1)}pt
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          <button onClick={() => setOverrides({})} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
            現状値にリセット
          </button>
          <button onClick={applyTarget} className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700">
            全フェーズ目標値を適用
          </button>
          <button onClick={applyBest} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
            楽観シナリオ（目標+5%）
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="grid grid-cols-4 gap-3 mb-3">
          {[
            { label: '現在の成約件数', value: `${base.close}件`, sub: `CVR ${cvrBase}%`, color: 'text-gray-700' },
            { label: 'シミュ後成約件数', value: `${sim.close}件`, sub: `CVR ${cvrSim}%`, color: sim.close > base.close ? 'text-emerald-600' : 'text-red-500' },
            { label: '成約件数の変化', value: `${dc >= 0 ? '+' : ''}${dc}件`, sub: '前月比', color: dc >= 0 ? 'text-emerald-600' : 'text-red-500' },
            { label: '月次売上への影響', value: `${dr >= 0 ? '+' : ''}${fmtY(dr)}`, sub: `平均手数料 ¥${fmtN(AVG_FEE)}/件`, color: dr >= 0 ? 'text-emerald-600' : 'text-red-500' },
          ].map(c => (
            <div key={c.label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{c.label}</p>
              <p className={`text-xl font-medium ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          全体CVR: {cvrBase}% → <strong style={{ color: parseFloat(cvrSim) > parseFloat(cvrBase) ? G : R }}>{cvrSim}%</strong>
          　月次売上: {fmtY(baseRev)} → <strong style={{ color: dr >= 0 ? G : R }}>{fmtY(simRev)}</strong>
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">フェーズ別 歩留まり+1pt の売上インパクト</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={impactData} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v}万`} />
            <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: '#555' }} />
            <Tooltip formatter={(v) => [`+¥${Number(v)}万/月`, '売上インパクト']} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {impactData.map(d => <Cell key={d.name} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ExtTab() {
  const [selExt, setSelExt] = useState('cpc')
  const factor = EXTERNAL_FACTORS.find(f => f.id === selExt)!
  const weekData = factor.weeklyTrend.map((v, i) => ({ week: `W${i + 1}`, value: v }))
  const lineColor = factor.currentLevel === 'positive' ? G : R
  const phaseIds = PHASES.map(p => p.id)

  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">外部要因 × フェーズ 影響マトリクス</p>
        <p className="text-xs text-gray-400 mb-3">どの外部要因がどのフェーズの歩留まりに効くか可視化</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 text-gray-400 font-normal border-b border-gray-100 whitespace-nowrap">外部要因 / フェーズ</th>
                {PHASES.map(p => (
                  <th key={p.id} className="py-2 px-1.5 text-center text-gray-400 font-normal border-b border-gray-100 text-xs">
                    {p.icon}<br />{p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXTERNAL_FACTORS.map(f => (
                <tr key={f.id}>
                  <td className="py-2 px-3 font-medium text-gray-800 border-b border-gray-100 whitespace-nowrap">
                    {f.icon} {f.name}
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${f.currentLevel === 'positive' ? 'bg-emerald-100 text-emerald-700' : f.currentLevel === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                      {f.currentLevel === 'positive' ? '↑' : f.currentLevel === 'negative' ? '↓' : '→'}
                    </span>
                  </td>
                  {phaseIds.map(pid => {
                    const imp = (IMPACT_MATRIX[f.id]?.[pid] ?? '–') as PhaseImpact
                    const s = impactStyle(imp)
                    return (
                      <td key={pid} className="py-2 px-1.5 text-center border-b border-gray-100"
                        style={{ background: s.bg, color: s.color }}>
                        {s.label}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">外部要因トレンド（12週）</p>
          <select
            value={selExt}
            onChange={e => setSelExt(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600"
          >
            {EXTERNAL_FACTORS.map(f => <option key={f.id} value={f.id}>{f.icon} {f.name}</option>)}
          </select>
        </div>
        <div className="flex gap-3 mb-2 text-xs">
          <span className={`px-2 py-0.5 rounded-full font-medium ${factor.currentLevel === 'positive' ? 'bg-emerald-100 text-emerald-700' : factor.currentLevel === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
            {factor.currentValue}
          </span>
          <span className="text-gray-400">{factor.description}</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#888' }} />
            <YAxis tick={{ fontSize: 10, fill: '#888' }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={lineColor}
              strokeWidth={2} dot={{ r: 3 }}
              fill={`${lineColor}18`} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function AITab() {
  const [aiPhase, setAiPhase] = useState('ad')
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  const phase = PHASES.find(p => p.id === aiPhase)!

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  const chips = [
    `「${phase.name}」の歩留まりが下がっている根本原因は？`,
    'どのフェーズ改善が売上インパクト最大？',
    'ISセミナー→IS引き渡しのボトルネックは？',
    '外部要因でどれがファネルに一番影響している？',
    '今月の最優先施策をTOP3挙げて',
  ]

  const ask = (q: string) => {
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: getReply(q) }])
    }, 700)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">AI要因分析</p>
        <p className="text-xs text-gray-400">フェーズ構造・外部要因を踏まえて回答</p>
      </div>

      <div className="flex gap-1 flex-wrap mb-3">
        {PHASES.map(p => (
          <button
            key={p.id}
            onClick={() => setAiPhase(p.id)}
            className={`text-xs px-2 py-1 rounded-lg border transition-colors ${aiPhase === p.id ? 'text-white border-transparent' : 'text-gray-500 border-gray-200'}`}
            style={{ background: aiPhase === p.id ? p.ownerColor : undefined }}
          >
            {p.icon} {p.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {chips.map(q => (
          <button
            key={q}
            onClick={() => ask(q)}
            className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      <div ref={chatRef} className="flex flex-col gap-2 max-h-72 overflow-y-auto mb-3">
        {messages.length === 0 && (
          <p className="text-xs text-gray-300 text-center py-6">上のチップをクリックするか、自由に質問してください</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`text-xs leading-relaxed px-3 py-2 rounded-xl max-w-[96%] whitespace-pre-wrap ${m.role === 'user' ? 'bg-gray-900 text-white self-end rounded-br-sm' : 'bg-gray-100 text-gray-800 self-start rounded-bl-sm'}`}>
            {m.text.replace(/\*\*(.*?)\*\*/g, '$1')}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && input.trim()) ask(input.trim()) }}
          placeholder="例: ISセミナー後のコールスピードを改善するには？"
          className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-gray-800 outline-none focus:border-gray-400"
        />
        <button
          onClick={() => { if (input.trim()) ask(input.trim()) }}
          className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm shrink-0 hover:bg-gray-700"
        >
          ↑
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState<Tab>('funnel')
  const [monthIndex, setMonthIndex] = useState(3)
  const [selectedPhase, setSelectedPhase] = useState('ad')
  const [monthlyData, setMonthlyData] = useState<MonthlyRecord[]>(MONTHLY)
  const [monthLabels, setMonthLabels] = useState<string[]>(MONTH_LABELS)
  const [csvError, setCsvError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhaseClick = (id: string) => {
    setSelectedPhase(id)
    setTab('phase')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const result = parseCSV(text)
      if (result && result.data.length > 0) {
        setMonthlyData(result.data)
        setMonthLabels(result.labels)
        setMonthIndex(0)
        setCsvError('')
      } else {
        setCsvError('CSVの形式が正しくありません。テンプレートを確認してください。')
      }
    }
    reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }

  const resetData = () => {
    setMonthlyData(MONTHLY)
    setMonthLabels(MONTH_LABELS)
    setMonthIndex(3)
    setCsvError('')
  }

  const isCustomData = monthlyData !== MONTHLY

  return (
    <div className="min-h-screen bg-gray-50">
<<<<<<< HEAD
      {/* ヘッダー */}
=======
>>>>>>> 08ebe50500ae1b90f99d95b12b75481da2b6c8a7
      <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-sm font-semibold text-gray-900">
          セールスファネル ダッシュボード
          {isCustomData && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
              CSVデータ反映中
            </span>
          )}
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          {csvError && (
            <span className="text-xs text-red-500">{csvError}</span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={downloadTemplate}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            テンプレDL
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            CSVを読み込む
          </button>
          {isCustomData && (
            <button
              onClick={resetData}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              デフォルトに戻す
            </button>
          )}
          <span className="text-xs text-gray-400">月次:</span>
          <select
            value={monthIndex}
            onChange={e => setMonthIndex(Number(e.target.value))}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600"
          >
            {monthLabels.map((label, i) => <option key={i} value={i}>{label}</option>)}
          </select>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 px-5">
        <nav className="flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-xs px-4 py-3 border-b-2 transition-colors ${tab === t.id ? 'border-gray-900 text-gray-900 font-medium' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <main className="max-w-5xl mx-auto p-4">
        {tab === 'funnel' && (
          <FunnelTab
            monthIndex={monthIndex}
            onPhaseClick={handlePhaseClick}
            monthlyData={monthlyData}
            monthLabels={monthLabels}
          />
        )}
        {tab === 'phase' && (
          <PhaseTab
            monthIndex={monthIndex}
            initialPhase={selectedPhase}
            monthlyData={monthlyData}
            monthLabels={monthLabels}
          />
        )}
        {tab === 'sim' && (
          <SimTab monthIndex={monthIndex} monthlyData={monthlyData} />
        )}
        {tab === 'ext' && <ExtTab />}
        {tab === 'ai' && <AITab />}
      </main>
    </div>
  )
}
