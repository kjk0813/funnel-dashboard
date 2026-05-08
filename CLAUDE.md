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
  { ad: 95000, sem_y: 2.4, is_y: 51.2, appt_y: 82.8, first_y: 60.2, prop_y: 68.4, close_y: 65.8, up_y: 26.2 },
  ...
]
export const AVG_FEE = 92000  // 平均手数料（円/件）
```

## GitHub Pages URL

https://kjk0813.github.io/funnel-dashboard/
