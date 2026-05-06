export type PhaseImpact = '+h' | '+m' | '+l' | '-h' | '-m' | '-l' | '–'

export type ExternalFactor = {
  id: string
  name: string
  icon: string
  description: string
  currentValue: string
  currentLevel: 'positive' | 'neutral' | 'negative'
  trend: 'up' | 'flat' | 'down'
  strength: number
  weeklyTrend: number[]
}

export type PhaseImpactMatrix = Record<string, Record<string, PhaseImpact>>

export const EXTERNAL_FACTORS: ExternalFactor[] = [
  {
    id: 'cpc',
    name: '広告CPC相場',
    icon: '💰',
    description: 'ターゲットキーワードのCPC高騰。広告→セミナー申込のCACを悪化させている。',
    currentValue: '業界KW ¥1,840（+24%）',
    currentLevel: 'negative',
    trend: 'up',
    strength: 0.92,
    weeklyTrend: [1220, 1260, 1300, 1340, 1400, 1460, 1500, 1560, 1620, 1700, 1760, 1840],
  },
  {
    id: 'sns',
    name: 'SNS・検索需要',
    icon: '📊',
    description: '関連キーワードの検索量が急増。セミナー需要・オーガニック流入に追い風。',
    currentValue: '関連KW検索量 前年比+142%',
    currentLevel: 'positive',
    trend: 'up',
    strength: 0.74,
    weeklyTrend: [42, 52, 62, 74, 86, 98, 108, 118, 128, 136, 140, 142],
  },
  {
    id: 'season',
    name: '季節性・制度',
    icon: '📅',
    description: '年度末・予算消化シーズン。受注需要が集中する最大チャンスの時期。',
    currentValue: '年度末予算消化・Q4シーズン',
    currentLevel: 'positive',
    trend: 'up',
    strength: 0.84,
    weeklyTrend: [96, 90, 82, 68, 60, 56, 58, 64, 70, 78, 86, 94],
  },
  {
    id: 'market',
    name: '市場マインド',
    icon: '📈',
    description: '業界全体のDX投資意欲。景況感・規制動向が企業の購買判断に影響する。',
    currentValue: '株高・DX投資意欲は強い',
    currentLevel: 'positive',
    trend: 'flat',
    strength: 0.86,
    weeklyTrend: [60, 64, 68, 74, 78, 82, 80, 84, 86, 84, 88, 90],
  },
  {
    id: 'competitor',
    name: '競合動向',
    icon: '🦊',
    description: '主要競合が無料プランを拡大中。IS・提案フェーズで価格比較・離脱が増加。',
    currentValue: '競合2社が無料キャンペーン拡大中',
    currentLevel: 'negative',
    trend: 'down',
    strength: 0.78,
    weeklyTrend: [28, 34, 40, 46, 52, 58, 62, 66, 70, 74, 78, 80],
  },
  {
    id: 'econ',
    name: '消費者信頼感',
    icon: '📉',
    description: '物価高騰・実質賃金マイナスが継続。高額商品の判断に慎重化が見られる。',
    currentValue: '消費者信頼感 36.4（-2.1）',
    currentLevel: 'negative',
    trend: 'down',
    strength: 0.64,
    weeklyTrend: [48, 46, 44, 42, 40, 39, 38, 37.5, 37.8, 37.2, 36.8, 36.4],
  },
]

export const IMPACT_MATRIX: PhaseImpactMatrix = {
  cpc: {
    ad: '-h', sem: '–', is: '–', appt: '–', first: '–', prop: '-l', close: '–', upsell: '–',
  },
  sns: {
    ad: '+h', sem: '+m', is: '+l', appt: '–', first: '–', prop: '–', close: '–', upsell: '–',
  },
  season: {
    ad: '+h', sem: '+h', is: '+m', appt: '+l', first: '+m', prop: '+l', close: '+l', upsell: '+l',
  },
  market: {
    ad: '+m', sem: '+m', is: '+m', appt: '–', first: '+m', prop: '-m', close: '+l', upsell: '+m',
  },
  competitor: {
    ad: '-l', sem: '-l', is: '-m', appt: '-l', first: '-h', prop: '-h', close: '-m', upsell: '-h',
  },
  econ: {
    ad: '-l', sem: '-l', is: '-m', appt: '-l', first: '-m', prop: '-m', close: '-l', upsell: '-l',
  },
}
