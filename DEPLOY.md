# AI Event Aggregator - Vercelデプロイガイド

## 概要
このプロジェクトはConnpass、Meetup、Lumaからイベント情報を集約して検索できるアプリです。

## 技術スタック
- **フロントエンド**: React 19 + TypeScript + Tailwind CSS 4
- **バックエンド**: Vercel Serverless Functions (@vercel/node)
- **API統合**: Connpass, Meetup, Luma

## ローカル開発

### 環境構築
```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

開発サーバーは `http://localhost:3000` で起動します。

## Vercelへのデプロイ

### 1. Vercel CLIのインストール
```bash
npm i -g vercel
```

### 2. Vercelにログイン
```bash
vercel login
```

### 3. プロジェクトをデプロイ
```bash
# 初回デプロイ
vercel

# 本番環境へのデプロイ
vercel --prod
```

### 4. 環境変数の設定（必要に応じて）
Vercelダッシュボードで環境変数を設定してください。

## プロジェクト構成

```
event-aggregator-app/
├── api/                          # Vercel Serverless Functions
│   ├── connpass.ts              # Connpass API統合
│   ├── meetup.ts                # Meetup API統合
│   ├── luma.ts                  # Luma API統合
│   └── aggregate.ts             # イベント集約エンドポイント
├── client/                       # フロントエンド
│   ├── src/
│   │   ├── components/          # React コンポーネント
│   │   │   ├── EventCard.tsx    # イベントカード
│   │   │   └── SearchFilter.tsx # 検索フィルター
│   │   ├── pages/               # ページコンポーネント
│   │   │   └── Home.tsx         # ホームページ
│   │   ├── hooks/               # カスタムフック
│   │   │   └── useEventAggregator.ts
│   │   ├── types/               # TypeScript型定義
│   │   │   └── event.ts
│   │   └── index.css            # グローバルスタイル
│   └── index.html               # HTML テンプレート
├── server/                       # Express サーバー（オプション）
├── vercel.json                   # Vercel設定
├── vite.config.ts               # Vite設定
└── package.json                 # プロジェクト設定

```

## 機能

### 検索フィルター
- **キーワード**: AIなどのキーワードで検索
- **地域**: 東京、大阪など地域を指定
- **プラットフォーム**: Connpass、Meetup、Lumaから選択

### イベント表示
- プラットフォームバッジ（色分け）
- イベント日時、場所、参加者数
- 外部リンクへのアクセス

## デザイン哲学

**テック・ミニマリズム**: シンプルで洗練された、機能性を最優先とした美学

- クリーンなカラーパレット（青#0066FF、オレンジ#FF6600）
- 明確な情報階層
- レスポンシブデザイン対応

## トラブルシューティング

### APIエラーが表示される
- 外部APIが利用可能か確認してください
- ネットワーク接続を確認してください
- ブラウザのコンソールでエラーメッセージを確認してください

### ポート3000が使用中の場合
Viteは自動的に次のポートを使用します（3001、3002など）

## ライセンス
MIT

## サポート
問題が発生した場合は、GitHubのIssueを作成してください。
