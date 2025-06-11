# React + TypeScript + Vite プロジェクト

このプロジェクトは、React + TypeScript + Viteの環境に、厳格なコードフォーマットとリントの設定を追加した開発環境です。

## 開発環境の概要

### 導入されているツール

1. **Prettier** - コードフォーマッター
2. **ESLint** - JavaScriptとTypeScriptのリンター（厳格設定）
3. **TypeScript** - 型チェック（厳格設定）
4. **EditorConfig** - エディタ設定の統一
5. **VS Code設定** - 推奨拡張機能と設定

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

## 利用可能なスクリプト

### 開発時

```bash
# 開発サーバーの起動
npm run dev

# TypeScriptの型チェック（ウォッチモード）
npm run typecheck:watch

# リントエラーの確認
npm run lint

# リントエラーの自動修正
npm run lint:fix

# コードフォーマット
npm run format
```

### ビルド時

```bash
# 本番ビルド（型チェック + 厳格リント + ビルド）
npm run build

# 型チェックのみ
npm run typecheck

# 厳格なリントチェック（警告もエラーとして扱う）
npm run lint:strict

# フォーマットチェック（CIで使用）
npm run format:check
```

### CI/CD時

```bash
# すべてのチェックを実行（型チェック + 厳格リント + フォーマットチェック）
npm run ci

# または個別に実行
npm run check:all
```

### その他の便利なコマンド

```bash
# リントとフォーマットを同時に修正
npm run fix:all
```

## 設定ファイルの詳細

### 1. Prettier設定（.prettierrc.json）

主な設定:
- セミコロン: 必須
- 末尾カンマ: すべて
- シングルクォート: 使用
- 行の長さ: 100文字
- タブ幅: 2スペース
- 改行コード: LF（Unix形式）

### 2. ESLint設定（eslint.config.js）

導入されているルール:
- **TypeScript厳格ルール**: `strictTypeChecked`と`stylisticTypeChecked`を使用
- **React関連**: React Hooks、React Refresh、JSX-A11yのルール
- **Import順序**: 自動整理とアルファベット順
- **エラー処理**: console.log禁止（warn/errorは許可）、debugger禁止
- **型安全性**: any禁止、非nullアサーション禁止、厳格なブール式

主要な設定:
- Prettierとの統合
- TypeScriptの型チェック付きルール
- Reactのベストプラクティス
- アクセシビリティチェック
- インポート順序の自動整理

### 3. TypeScript設定（tsconfig.app.json）

厳格化された設定:
- `strict`: true（すべての厳格オプションを有効化）
- `noImplicitAny`: true（暗黙的なany禁止）
- `noUncheckedIndexedAccess`: true（配列アクセスの安全性）
- `exactOptionalPropertyTypes`: true（オプショナルプロパティの厳格化）
- `noPropertyAccessFromIndexSignature`: true（インデックス署名からのプロパティアクセス禁止）
- パスエイリアス: `@/*` → `./src/*`

### 4. EditorConfig（.editorconfig）

エディタ間で統一される設定:
- 文字コード: UTF-8
- 改行コード: LF
- インデント: スペース2つ
- 末尾の空白: 削除
- 最終行: 改行を挿入

### 5. VS Code設定

#### 推奨拡張機能（.vscode/extensions.json）
- Prettier
- ESLint  
- EditorConfig
- GitLens
- Error Lens
- その他開発効率化ツール

#### エディタ設定（.vscode/settings.json）
- 保存時の自動フォーマット
- ESLintの自動修正
- TypeScriptのインポート自動更新
- ファイル保存時の末尾空白削除

## 開発フロー

### 1. 開発時

1. VS Codeで推奨拡張機能をインストール
2. `npm run dev`で開発サーバーを起動
3. 別ターミナルで`npm run typecheck:watch`を実行（リアルタイム型チェック）
4. コードを書く（保存時に自動フォーマット）
5. 定期的に`npm run lint`でリントチェック

### 2. コミット前

1. `npm run fix:all`で自動修正可能な問題を解決
2. `npm run check:all`ですべてのチェックを実行
3. エラーがなければコミット

### 3. ビルド時

`npm run build`を実行すると以下が自動実行されます:
1. TypeScriptの型チェック
2. ESLintの厳格チェック（警告もエラー扱い）
3. Viteによるビルド

### 4. CI/CD

`npm run ci`で以下のチェックが実行されます:
- TypeScript型チェック
- ESLint厳格チェック
- Prettierフォーマットチェック

## トラブルシューティング

### ESLintエラーが解決できない場合

```bash
# キャッシュをクリア
rm -rf node_modules/.cache/eslint

# 自動修正を試す
npm run lint:fix
```

### TypeScriptエラーが解決できない場合

```bash
# ビルドキャッシュをクリア
rm -rf node_modules/.tmp

# TypeScriptを再起動（VS Code）
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### フォーマットが効かない場合

1. `.prettierrc.json`が存在することを確認
2. VS Codeのデフォルトフォーマッターが`esbenp.prettier-vscode`になっているか確認
3. `npm run format`を手動実行

## ベストプラクティス

1. **コミット前には必ず`npm run check:all`を実行**
2. **型定義は明示的に記述**（TypeScriptの推論に頼りすぎない）
3. **anyの使用は避け、unknownまたは具体的な型を使用**
4. **コンポーネントのpropsには必ず型定義**
5. **importは自動整理されるので手動で並べ替えない**

## 参考リンク

- [Prettier公式ドキュメント](https://prettier.io/)
- [ESLint公式ドキュメント](https://eslint.org/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
- [EditorConfig公式サイト](https://editorconfig.org/)
