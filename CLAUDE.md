# セールスファネル ダッシュボード

React + TypeScript + Vite で構築した 8フェーズ・セールスファネル分析ダッシュボード。
月次の歩留まりデータを可視化し、改善シミュレーションや外部要因分析を行う。

## 技術スタック

- **フレームワーク**: React 19 + TypeScript 6
- **ビルド**: Vite 8 + @tailwindcss/vite (Tailwind CSS v4)
- **グラフ**: recharts v3
- **AI予定**: @google/generative-ai (Gemini API、未接続)
- **デプロイ**: GitHub Pages（GitHub Actions 自動デプロイ）

## ローカル起動

```bash
npm install
npm run dev        # http://localhost:5174
npm run build      # dist/ に本番ビルド
```

## ディレクトリ構成

```
src/
├── data/
│   ├── phases.ts       # 8フェーズ定義（歩留まり目標・課題・施策）
│   ├── monthly.ts      # 月次ダミーデータ（9〜12月）と平均手数料
│   └── external.ts     # 外部要因6種の定義・フェーズ影響マトリクス
├── hooks/
│   └── useFunnelCalc.ts  # ファネル計算ロジック（calcVols / calcClose / calcRevenue）
├── App.tsx             # 全タブのUI（単一ファイル構成）
├── main.tsx
└── index.css           # Tailwind v4 インポート
.github/
└── workflows/
    └── deploy.yml      # GitHub Pages 自動デプロイ
```

## 5タブ構成

| タブ | 内容 |
|------|------|
| ファネル全体 | KPI 4カード・フェーズ行（ボリューム＋歩留まり）・月次トレンドチャート |
| フェーズ詳細 | 説明変数（課題）・改善施策・歩留まり+1ptインパクト表示 |
| 改善シミュ | 歩留まりスライダー・目標値適用ボタン・成約件数/売上リアルタイム計算 |
| 外部要因 | 要因×フェーズ影響マトリクス・12週トレンドチャート |
| AI分析 | KBベースのチャットUI（将来 Gemini API 接続予定） |

## データ更新方法

### 月次データを差し替える（src/data/monthly.ts）

```ts
export const MONTHLY: MonthlyRecord[] = [
  // 各月のデータを差し替える
  { ad: 95000, sem_y: 2.4, is_y: 51.2, appt_y: 82.8, first_y: 60.2, prop_y: 68.4, close_y: 65.8, up_y: 26.2 },
  ...
]
export const AVG_FEE = 92000  // 平均手数料（円/件）
```

| キー | 意味 | 単位 |
|------|------|------|
| `ad` | 広告インプレッション数 | imp |
| `sem_y` | 広告→セミナー申込率 | % |
| `is_y` | セミナー→IS移行率 | % |
| `appt_y` | IS→アポ獲得率 | % |
| `first_y` | アポ→初回商談率 | % |
| `prop_y` | 初回商談→提案率 | % |
| `close_y` | 提案→成約率 | % |
| `up_y` | 成約→追加購入率 | % |

### フェーズ目標値を変える（src/data/phases.ts）

`yieldTarget` の値を変更する。`impactPerPt` は歩留まり+1ptの月次売上インパクト（円）。

### 外部要因を追加・変更する（src/data/external.ts）

`EXTERNAL_FACTORS` に要素を追加し、`IMPACT_MATRIX` にそのIDのキーを追加する。
影響マトリクスの値: `'+h'`（強いポジ）〜`'-h'`（強いネガ）、`'–'`（影響なし）

## 計算ロジック（useFunnelCalc.ts）

```
ad → [×sem_y%] → sem → [×is_y%] → is → [×appt_y%] → appt
→ [×first_y%] → first → [×prop_y%] → prop → [×close_y%] → close
→ [×up_y%] → upsell
```

`calcVols(monthIndex, overrides)` でオーバーライドを渡すとシミュ計算に使用。

## 今後の実装予定

- [ ] AI分析タブに Gemini API 接続（`VITE_GEMINI_API_KEY` 環境変数を使用）
- [ ] 実データCSV取り込み機能
- [ ] 月次データ追加（1月以降）
- [ ] フェーズ別担当者設定・アラート機能

## GitHub Pages URL

https://kjk0813.github.io/funnel-dashboard/
