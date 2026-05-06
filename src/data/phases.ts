export type Issue = {
  id: string
  label: string
  impact: 'high' | 'mid'
  currentValue: string
  dir: 'bad' | 'good' | 'neutral'
}

export type Action = {
  id: string
  label: string
  type: 'vol' | 'rate'
}

export type Phase = {
  id: string
  name: string
  icon: string
  owner: 'マーケ' | 'IS' | 'FS' | 'CS'
  ownerColor: string
  volUnit: string
  yieldKey: string | null
  yieldTarget: number | null
  yieldLabel: string
  yieldFormula: string
  impactPerPt: number
  issues: Issue[]
  actions: Action[]
}

export const PHASES: Phase[] = [
  {
    id: 'ad', name: '広告', icon: '📣', owner: 'マーケ', ownerColor: '#185FA5',
    volUnit: 'imp',
    yieldKey: 'sem_y', yieldTarget: 2.8,
    yieldLabel: '広告→セミナー申込率', yieldFormula: 'セミナー申込数 / 広告imp × 100',
    impactPerPt: 95000,
    issues: [
      { id: 'ad_ctr', label: 'クリエイティブCTR', impact: 'high', currentValue: '1.4%（目標2.2%）', dir: 'bad' },
      { id: 'ad_lp', label: 'セミナーLP CV率', impact: 'high', currentValue: '71%（目標55%以下）', dir: 'bad' },
      { id: 'ad_copy', label: 'LP訴求設計（ベネフィット）', impact: 'high', currentValue: '課題訴求・限定訴求が不足', dir: 'bad' },
      { id: 'ad_target', label: 'ターゲティング精度', impact: 'mid', currentValue: 'ターゲット業種への絞り込み不足', dir: 'bad' },
      { id: 'ad_timing', label: '掲出タイミング', impact: 'mid', currentValue: '繁忙期への集中出稿が未実施', dir: 'bad' },
    ],
    actions: [
      { id: 'ad_ab', label: 'クリエイティブA/Bテスト（週次改善）', type: 'rate' },
      { id: 'ad_lp_fix', label: 'セミナーLP改修（訴求・フォーム短縮）', type: 'rate' },
      { id: 'ad_retarget', label: 'リターゲティング広告強化', type: 'vol' },
      { id: 'ad_budget', label: '広告予算増・媒体追加（YouTube等）', type: 'vol' },
    ],
  },
  {
    id: 'sem', name: 'セミナー', icon: '🤝', owner: 'マーケ', ownerColor: '#185FA5',
    volUnit: '参加者',
    yieldKey: 'is_y', yieldTarget: 58,
    yieldLabel: 'セミナー参加→IS移行率', yieldFormula: 'IS対応移行数 / セミナー参加数 × 100',
    impactPerPt: 280000,
    issues: [
      { id: 'sem_attend', label: 'セミナー出席率（申込→出席）', impact: 'high', currentValue: '69%（目標82%）', dir: 'bad' },
      { id: 'sem_speed', label: 'ISへの引き渡しスピード', impact: 'high', currentValue: '参加後平均51時間（目標4時間以内）', dir: 'bad' },
      { id: 'sem_sat', label: 'コンテンツ満足度', impact: 'high', currentValue: '3.3/5（目標4.2以上）', dir: 'bad' },
      { id: 'sem_scoring', label: 'ホットリード識別', impact: 'mid', currentValue: '温度感スコアリング未実装', dir: 'bad' },
    ],
    actions: [
      { id: 'sem_remind', label: 'リマインドメール3段階自動化（3日前・前日・当日）', type: 'vol' },
      { id: 'sem_sla', label: 'セミナー後4時間以内コールSLA設定', type: 'rate' },
      { id: 'sem_scoring_impl', label: 'アンケート×行動データでスコアリング導入', type: 'rate' },
      { id: 'sem_freq', label: '開催頻度・定員増（週2回オンライン化）', type: 'vol' },
    ],
  },
  {
    id: 'is', name: 'IS対応', icon: '📞', owner: 'IS', ownerColor: '#1D9E75',
    volUnit: '件',
    yieldKey: 'appt_y', yieldTarget: 88,
    yieldLabel: 'IS対応→アポ獲得率', yieldFormula: 'アポ獲得数 / IS対応件数 × 100',
    impactPerPt: 520000,
    issues: [
      { id: 'is_speed', label: '初回コールスピード', impact: 'high', currentValue: 'セミナー後平均51時間（目標4時間以内）', dir: 'bad' },
      { id: 'is_bant', label: 'BANTヒアリング完了率', impact: 'high', currentValue: '41%（目標75%）', dir: 'bad' },
      { id: 'is_gap', label: '担当者間アポ獲得率のばらつき', impact: 'high', currentValue: '最大31ptの差（最良68%・最低37%）', dir: 'bad' },
      { id: 'is_call', label: 'コール試行回数', impact: 'mid', currentValue: '平均1.7回（目標3回×3日ルール）', dir: 'bad' },
    ],
    actions: [
      { id: 'is_sla', label: 'セミナー後4時間以内コールSLA＋アラート自動通知', type: 'rate' },
      { id: 'is_script', label: 'BANTスクリプト標準化・週次ロールプレイ強化', type: 'rate' },
      { id: 'is_rule', label: '3コール×3日間ルール設定（追跡管理の仕組み化）', type: 'rate' },
      { id: 'is_head', label: 'IS人員増・外部BPO活用でカバレッジ拡大', type: 'vol' },
    ],
  },
  {
    id: 'appt', name: 'アポイント', icon: '📅', owner: 'IS', ownerColor: '#1D9E75',
    volUnit: '件',
    yieldKey: 'first_y', yieldTarget: 92,
    yieldLabel: 'アポ→初回商談実施率', yieldFormula: '初回商談実施数 / アポ獲得数 × 100',
    impactPerPt: 780000,
    issues: [
      { id: 'appt_noshow', label: 'ノーショー率', impact: 'high', currentValue: '20.6%（目標8%以下）', dir: 'bad' },
      { id: 'appt_gap', label: 'アポ設定後商談間隔', impact: 'mid', currentValue: '平均6.8日（目標3日以内）', dir: 'bad' },
      { id: 'appt_tool', label: 'オンライン接続トラブル', impact: 'mid', currentValue: '全体の9.2%でURL不備・接続失敗', dir: 'bad' },
    ],
    actions: [
      { id: 'appt_sms', label: '前日・当日リマインドSMS＋メール自動送信', type: 'rate' },
      { id: 'appt_cal', label: 'カレンダー連携ツール（Zoom自動発行・リンク事前送付）', type: 'rate' },
      { id: 'appt_quick', label: 'アポ設定後3日以内に商談を優先スケジュール', type: 'rate' },
    ],
  },
  {
    id: 'first', name: '初回商談', icon: '💻', owner: 'FS', ownerColor: '#EF9F27',
    volUnit: '件',
    yieldKey: 'prop_y', yieldTarget: 72,
    yieldLabel: '初回商談→提案移行率', yieldFormula: '提案実施数 / 初回商談数 × 100',
    impactPerPt: 1180000,
    issues: [
      { id: 'first_hear', label: 'ヒアリング品質（SPINの実施）', impact: 'high', currentValue: '提案前進率46%（目標64%）', dir: 'bad' },
      { id: 'first_fit', label: '顧客ニーズ×製品適合度', impact: 'high', currentValue: '製品適合スコア61pt（目標78pt）', dir: 'bad' },
      { id: 'first_nxa', label: '次アクション合意率（NXA）', impact: 'mid', currentValue: '54%（目標82%）', dir: 'bad' },
      { id: 'first_gap', label: 'FS担当者スキルギャップ', impact: 'mid', currentValue: '担当者間提案移行率差: 最大34pt', dir: 'bad' },
    ],
    actions: [
      { id: 'first_spin', label: 'SPINヒアリングシート標準化・オンライン商談ガイド更新', type: 'rate' },
      { id: 'first_nxa_rule', label: 'NXA（次のアクション）合意を商談クロージングに組み込む', type: 'rate' },
      { id: 'first_playbook', label: '商談進捗→優秀FSの録画→プレイブック化（週次共有）', type: 'rate' },
    ],
  },
  {
    id: 'prop', name: '提案', icon: '📄', owner: 'FS', ownerColor: '#EF9F27',
    volUnit: '件',
    yieldKey: 'close_y', yieldTarget: 74,
    yieldLabel: '提案→成約率', yieldFormula: '成約数 / 提案数 × 100',
    impactPerPt: 2040000,
    issues: [
      { id: 'prop_custom', label: '提案書パーソナライズ度', impact: 'high', currentValue: '標準テンプレート使用率86%（個別化なし）', dir: 'bad' },
      { id: 'prop_docs', label: '書類完備率', impact: 'high', currentValue: '71%（目標88%以上）', dir: 'bad' },
      { id: 'prop_time', label: '提案から成約のリードタイム', impact: 'mid', currentValue: '平均12.1日（目標7日以内）', dir: 'bad' },
      { id: 'prop_comp', label: '競合比較時の差別化訴求', impact: 'mid', currentValue: '「他社と何が違うか」への回答が弱い', dir: 'bad' },
    ],
    actions: [
      { id: 'prop_seg', label: '提案書セグメント別個別化（課題・ROI訴求で設計）', type: 'rate' },
      { id: 'prop_7d', label: '7日以内成約インセンティブ設計（早期決断の動機付け）', type: 'rate' },
      { id: 'prop_comp_kb', label: '競合対応ワークスクリプト（付加価値・差別化の言語化）', type: 'rate' },
    ],
  },
  {
    id: 'close', name: '成約', icon: '✅', owner: 'FS', ownerColor: '#EF9F27',
    volUnit: '件',
    yieldKey: 'up_y', yieldTarget: 38,
    yieldLabel: '成約→追加購入移行率', yieldFormula: '追加購入数 / 累積成約顧客数 × 100',
    impactPerPt: 3240000,
    issues: [
      { id: 'close_onboard', label: '成約後オンボーディング', impact: 'high', currentValue: '満足度3.2/5（目標4.3以上）', dir: 'bad' },
      { id: 'close_review', label: '定期レビュー実施率', impact: 'high', currentValue: '41%（目標72%）', dir: 'bad' },
      { id: 'close_nps', label: 'NPS・紹介創出率', impact: 'mid', currentValue: 'NPS 31（目標52以上）', dir: 'bad' },
    ],
    actions: [
      { id: 'close_welcome', label: '成約後72時間以内のウェルカムコール実施', type: 'rate' },
      { id: 'close_qbr', label: '半年ごとのポートフォリオレビュー仕組み化', type: 'rate' },
      { id: 'close_ref', label: '紹介プログラム設計（顧客が紹介したくなる体験設計）', type: 'rate' },
    ],
  },
  {
    id: 'upsell', name: '追加購入', icon: '📈', owner: 'CS', ownerColor: '#8B5CF6',
    volUnit: '件/月',
    yieldKey: null, yieldTarget: null,
    yieldLabel: 'LTV最大化フェーズ', yieldFormula: '追加購入件数 × 平均手数料 = 追加売上',
    impactPerPt: 0,
    issues: [
      { id: 'up_event', label: 'ライフイベント検知', impact: 'high', currentValue: '提案トリガーが属人的（手動）', dir: 'bad' },
      { id: 'up_churn', label: '継続率（解約防止）', impact: 'high', currentValue: '継続率83.8%（目標92%）', dir: 'bad' },
      { id: 'up_cross', label: 'クロス・アップセル幅', impact: 'mid', currentValue: '提案できる商品カテゴリが限定的', dir: 'bad' },
    ],
    actions: [
      { id: 'up_trigger', label: 'ライフイベントトリガー自動アラート（CRM連携）', type: 'rate' },
      { id: 'up_health', label: '解約予兆スコアリング導入→早期フォロー', type: 'rate' },
      { id: 'up_ref', label: '紹介プログラム経由で新規リード創出', type: 'vol' },
    ],
  },
]
