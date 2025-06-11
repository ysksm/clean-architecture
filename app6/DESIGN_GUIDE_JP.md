# タスク管理システム - 設計解説と使い方

## 📋 概要

このタスク管理システムは、**ドメイン駆動設計（DDD）**と**レイヤードアーキテクチャ**を採用したフルスタックアプリケーションです。フロントエンドとバックエンド間の通信には、JSONではなく**バイナリプロトコル**を使用している点が特徴的です。

## 🏗️ アーキテクチャ設計

### 全体構成図

```
┌─────────────────────────────────────────────────────────────┐
│                    タスク管理システム                        │
├─────────────────────────────────────────────────────────────┤
│  フロントエンド (React + TypeScript)                        │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │ Presentation    │ │ Application     │                   │
│  │ - Components    │ │ - Use Cases     │                   │
│  │ - Contexts      │ │ - Business Logic│                   │
│  └─────────────────┘ └─────────────────┘                   │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │ Domain          │ │ Infrastructure  │                   │
│  │ - Entities      │ │ - HTTP Client   │                   │
│  │ - Interfaces    │ │ - Binary Protocol│                  │
│  └─────────────────┘ └─────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│              バイナリ通信プロトコル (IDL定義)                │
├─────────────────────────────────────────────────────────────┤
│  バックエンド (Bun.sh + Express)                           │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │ Presentation    │ │ Application     │                   │
│  │ - Controllers   │ │ - Services      │                   │
│  │ - REST API      │ │ - DTOs          │                   │
│  └─────────────────┘ └─────────────────┘                   │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │ Domain          │ │ Infrastructure  │                   │
│  │ - Entities      │ │ - Repositories  │                   │
│  │ - Value Objects │ │ - Data Storage  │                   │
│  └─────────────────┘ └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### レイヤードアーキテクチャの詳細

#### 1. **プレゼンテーション層（Presentation Layer）**
**役割**: ユーザーインターフェースとユーザー操作の処理

```
フロントエンド:
├── TaskForm.tsx      # タスク作成フォーム
├── TaskList.tsx      # タスク一覧表示
├── TaskItem.tsx      # 個別タスク表示・編集
├── TaskStats.tsx     # 統計情報表示
└── TaskContext.tsx   # 状態管理

バックエンド:
└── TaskController.ts # API エンドポイント制御
```

**特徴**:
- フロントエンド: React コンポーネントとコンテキスト
- バックエンド: Express コントローラー
- バイナリデータの直接処理

#### 2. **アプリケーション層（Application Layer）**
**役割**: ビジネスロジックの調整とユースケースの実行

```
フロントエンド:
└── TaskUseCases.ts   # ビジネスロジック調整

バックエンド:
└── TaskApplicationService.ts # アプリケーションサービス
```

**特徴**:
- ドメイン層とインフラ層の橋渡し
- 入力検証とエラーハンドリング
- トランザクション管理

#### 3. **ドメイン層（Domain Layer）**
**役割**: ビジネスルールとドメインロジックの中核

```
共通構造:
├── Task.ts           # タスクエンティティ
├── TaskId.ts         # タスクID値オブジェクト
├── TaskTitle.ts      # タスクタイトル値オブジェクト
├── TaskDescription.ts # タスク説明値オブジェクト
├── TaskStatus.ts     # ステータス列挙型
├── TaskPriority.ts   # 優先度列挙型
└── ITaskRepository.ts # リポジトリインターフェース
```

**特徴**:
- フレームワークに依存しない純粋なビジネスロジック
- エンティティと値オブジェクトによるドメインモデル
- リッチドメインモデル（振る舞いを持つエンティティ）

#### 4. **インフラストラクチャ層（Infrastructure Layer）**
**役割**: 外部システムとの連携と技術的関心事

```
フロントエンド:
└── HttpTaskRepository.ts # HTTP通信実装

バックエンド:
└── InMemoryTaskRepository.ts # インメモリ保存実装
```

**特徴**:
- ドメイン層のインターフェースを実装
- データベース、API、ファイルシステムなどへのアクセス
- 技術選択の詳細を隠蔽

### 依存性逆転の原則

```
┌─────────────────┐    ┌─────────────────┐
│ ドメイン層      │◄───│ アプリケーション層 │
│ (抽象)          │    │                 │
└─────────────────┘    └─────────────────┘
         ▲                       ▲
         │                       │
         │              ┌─────────────────┐
         │              │ プレゼンテーション層│
         │              │                 │
         │              └─────────────────┘
         │
┌─────────────────┐
│ インフラ層      │
│ (具象実装)      │
└─────────────────┘
```

**ポイント**:
- ドメイン層は他のレイヤーに依存しない
- インフラ層がドメイン層のインターフェースを実装
- 技術変更時の影響を最小限に抑制

## 🔄 バイナリ通信プロトコル

### MIDL（TypeScript Decorator-based IDL）

本プロジェクトでは、独自開発の **MIDL（Memory-mapped IDL）** を採用しています。これは TypeScript Decorator を使用したバイナリデータ構造定義システムです。

#### **従来のIDLとの違い**

| 特徴 | Protocol Buffers | Apache Thrift | **MIDL** |
|------|-----------------|---------------|----------|
| メモリレイアウト制御 | ❌ 内部フォーマット | ❌ 抽象化 | ✅ **完全制御** |
| IDE支援 | ⚠️ 限定的 | ⚠️ 限定的 | ✅ **完璧なTypeScript支援** |
| ゼロコピー操作 | ❌ 不可 | ❌ 不可 | ✅ **直接メモリアクセス** |
| 学習コスト | 🔺 専用文法 | 🔺 専用文法 | ✅ **既存TypeScript知識** |

#### **MIDL スキーマ定義**

```typescript
// schemas/task.binary.ts
import { Binary, Field } from '../shared/midl/decorators/index.js';

export enum TaskStatus {
  PENDING = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3
}

export enum TaskPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  URGENT = 3
}

@Binary.struct({
  packed: true,        // パディングなし
  size: 1320,         // 固定サイズ
  endian: 'little'    // エンディアン指定
})
export class Task {
  @Field.u32(0)
  id!: number;

  @Field.string(4, { maxLength: 256 })
  title!: string;

  @Field.string(262, { maxLength: 1024 })
  description!: string;

  @Field.enumField(TaskStatus, 1288, { size: 4 })
  status!: TaskStatus;

  @Field.enumField(TaskPriority, 1292, { size: 4 })
  priority!: TaskPriority;

  @Field.timestamp(1296)
  dueDate!: Date;

  @Field.timestamp(1304)
  createdAt!: Date;

  @Field.timestamp(1312)
  updatedAt!: Date;

  // ドメインロジックも組み込み可能
  isCompleted(): boolean {
    return this.status === TaskStatus.COMPLETED;
  }
}

@Message.request(0x01)
export class CreateTaskRequest {
  @Field.string(0, { maxLength: 256 })
  title!: string;

  @Field.string(258, { maxLength: 1024 })
  description!: string;

  @Field.enumField(TaskPriority, 1282, { size: 4 })
  priority!: TaskPriority;

  @Field.timestamp(1286)
  dueDate!: Date;
}
```

#### **自動生成されるバイナリビュークラス**

```typescript
// 自動生成: shared/generated/task.generated.ts
export class TaskBinaryView extends BinaryViewBase {
  static readonly SIZE = 1320;
  static readonly OFFSETS = {
    id: 0,
    title: 4,
    description: 262,
    status: 1288,
    priority: 1292,
    dueDate: 1296,
    createdAt: 1304,
    updatedAt: 1312
  } as const;

  // ゼロコピーアクセサ
  get id(): number {
    return this.getU32(0, true);
  }

  set id(value: number) {
    this.setU32(0, value, true);
  }

  get title(): string {
    return this.getString(4, 256);
  }

  set title(value: string) {
    this.setString(4, value, 256);
  }

  // 他のフィールドアクセサ...

  // ドメインエンティティとの変換
  toDomainEntity(): DomainTask {
    return new DomainTask(
      this.id,
      this.title,
      this.description,
      this.status,
      this.priority,
      this.dueDate,
      this.createdAt,
      this.updatedAt
    );
  }
}
```

### 通信フロー図

```
フロントエンド                    バックエンド
┌─────────────┐                  ┌─────────────┐
│ TaskForm    │ createTask()     │ Controller  │
│             ├─────────────────►│             │
└─────────────┘ Binary Request   └─────────────┘
      ▲                                 │
      │ Binary Response                 ▼
      │                          ┌─────────────┐
      │                          │ Application │
      │                          │ Service     │
      │                          └─────────────┘
      │                                 │
      │                                 ▼
      │                          ┌─────────────┐
      │                          │ Domain      │
      │                          │ Entity      │
      │                          └─────────────┘
      │                                 │
      │                                 ▼
      │                          ┌─────────────┐
      └──────────────────────────│ Repository  │
                                 │             │
                                 └─────────────┘
```

### MIDL CLIツールの使用

```bash
# スキーマ分析
npm run midl:analyze

# コード生成  
npm run midl:generate

# バリデーション
npm run midl:validate

# メモリレイアウト可視化
npm run midl:visualize
```

**出力例**:
```
🎨 Memory Layout Visualization
============================================================

📐 Task:
Memory Layout (1320 bytes total)
────────────────────────────────────────────────────────────
   0-3    id                   u32
   4-261  title                string  
 262-1287 description          string
1288-1291 status               enum
1292-1295 priority             enum
1296-1303 dueDate              timestamp
1304-1311 createdAt            timestamp
1312-1319 updatedAt            timestamp

Memory Map:
    00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f
    ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
0000│I  I  I  I  T  T  T  T  T  T  T  T  T  T  T  T
0010│T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T
...

Legend:
  I = id (4 bytes)
  T = title (258 bytes)
  D = description (1026 bytes)
  S = status (4 bytes)
  P = priority (4 bytes)
```

### バイナリプロトコルの利点

1. **完全なメモリ制御**: バイト単位でのレイアウト指定
2. **ゼロコピー操作**: 直接メモリアクセスによる高性能
3. **型安全性**: TypeScriptの完璧な型サポート
4. **IDE支援**: IntelliSense、リファクタリング、エラー検出
5. **C言語互換**: 既存システムとの相互運用性
6. **デバッグ支援**: メモリレイアウト可視化とバリデーション

## 🛠️ セットアップと使い方

### 1. **環境構築**

```bash
# Bun.shのインストール（バックエンド用）
curl -fsSL https://bun.sh/install | bash

# プロジェクトディレクトリに移動
cd app6

# バックエンドの起動
cd backend
bun install
bun run dev  # http://localhost:3001

# フロントエンドの起動（別ターミナル）
cd frontend
npm install
npm run dev  # http://localhost:3000
```

### 2. **基本的な使い方**

#### タスクの作成
1. **タスクフォーム**にタスク情報を入力
   - **タイトル**（必須、最大256文字）
   - **説明**（任意、最大1024文字）
   - **優先度**（Low/Medium/High/Urgent）
   - **期日**（日時選択）

2. **「Create Task」ボタン**をクリック
3. 作成されたタスクが一覧の先頭に表示

#### タスクの管理
- **ステータス別表示**: 
  - 🟡 Pending（未着手）
  - 🔵 In Progress（進行中）
  - 🟢 Completed（完了）
  - ⚫ Cancelled（キャンセル）

- **インライン編集**: 各タスクの「Edit」ボタンから直接編集
- **削除**: 「Delete」ボタンで削除（確認ダイアログ付き）
- **期限管理**: 期限切れタスクは「OVERDUE」表示

#### 統計情報の確認
- **ダッシュボード**で各ステータスのタスク数を表示
- リアルタイムで更新
- 視覚的な統計カード

## 📊 データフロー図

### タスク作成のフロー

```
1. ユーザー入力
   ┌─────────────┐
   │ TaskForm    │
   │ (React)     │
   └──────┬──────┘
          │ form submit
          ▼
2. ユースケース実行
   ┌─────────────┐
   │ TaskUseCases│
   │ (validation)│
   └──────┬──────┘
          │ createTask()
          ▼
3. バイナリ通信
   ┌─────────────┐
   │HttpRepository│
   │(binary data)│
   └──────┬──────┘
          │ POST /api/tasks
          ▼
4. API処理
   ┌─────────────┐
   │TaskController│
   │(deserialize)│
   └──────┬──────┘
          │ applicationService
          ▼
5. ビジネスロジック
   ┌─────────────┐
   │AppService   │
   │(domain logic)│
   └──────┬──────┘
          │ save()
          ▼
6. データ永続化
   ┌─────────────┐
   │ Repository  │
   │ (in-memory) │
   └─────────────┘
```

### エラーハンドリングフロー

```
エラー発生時:
┌─────────────┐
│ Repository  │ → Error
└─────────────┘
       │
       ▼ catch & wrap
┌─────────────┐
│AppService   │ → Domain Error
└─────────────┘
       │
       ▼ catch & transform
┌─────────────┐
│TaskController│ → HTTP Error Response
└─────────────┘
       │
       ▼ binary response
┌─────────────┐
│HttpRepository│ → Network Error
└─────────────┘
       │
       ▼ catch & display
┌─────────────┐
│ UI Component│ → User Message
└─────────────┘
```

## 🧪 テスト戦略

### テストピラミッド

```
        ┌─────────────┐
        │    E2E      │ ← Playwright (フルワークフロー)
        │    Tests    │
        └─────────────┘
      ┌─────────────────┐
      │  Integration    │ ← Vitest/Bun (レイヤー間連携)
      │     Tests       │
      └─────────────────┘
    ┌─────────────────────┐
    │     Unit Tests      │ ← Vitest/Bun (各クラス・関数)
    │  (各レイヤー個別)   │
    └─────────────────────┘
```

### テスト種別の詳細

#### 1. **単体テスト（Unit Tests）**
```typescript
// ドメインエンティティのテスト例
describe('Task Entity', () => {
  it('should create task with valid data', () => {
    const task = Task.create(title, description, priority, dueDate);
    expect(task.isCompleted()).toBe(false);
  });

  it('should mark task as completed', () => {
    task.updateStatus(TaskStatus.COMPLETED);
    expect(task.isCompleted()).toBe(true);
  });
});
```

#### 2. **結合テスト（Integration Tests）**
```typescript
// レイヤー間連携のテスト例
describe('TaskApplicationService', () => {
  it('should create and persist task', async () => {
    const service = new TaskApplicationService(mockRepository);
    const result = await service.createTask(dto);
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
```

#### 3. **UIテスト（UI Tests）**
```typescript
// Reactコンポーネントのテスト例
describe('TaskForm', () => {
  it('should submit form with valid data', async () => {
    render(<TaskForm />);
    fireEvent.change(screen.getByLabelText('Title'), { 
      target: { value: 'Test Task' } 
    });
    fireEvent.click(screen.getByText('Create Task'));
    expect(mockCreateTask).toHaveBeenCalled();
  });
});
```

#### 4. **E2Eテスト（End-to-End Tests）**
```typescript
// ユーザーシナリオのテスト例
test('user can create and complete task', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="task-title"]', 'E2E Test Task');
  await page.click('[data-testid="create-button"]');
  await page.click('[data-testid="edit-button"]');
  await page.selectOption('[data-testid="status-select"]', 'COMPLETED');
  await page.click('[data-testid="save-button"]');
  await expect(page.locator('.completed-task')).toBeVisible();
});
```

## 🎯 設計の利点

### 1. **保守性（Maintainability）**
- **単一責任の原則**: 各クラスが一つの責任のみを持つ
- **疎結合**: レイヤー間の依存関係が最小限
- **高凝集**: 関連する機能が適切にグループ化

### 2. **拡張性（Extensibility）**
- **新機能追加**: 既存コードへの影響を最小限に抑制
- **技術変更**: インフラ層のみ変更で技術スタック変更可能
- **スケーラビリティ**: マイクロサービス化への発展が容易

### 3. **テスタビリティ（Testability）**
- **モック化**: 各レイヤーを独立してテスト可能
- **依存性注入**: テスト用の実装を簡単に差し替え
- **純粋関数**: 副作用のない関数によるテストの簡素化

### 4. **学習効果（Learning Benefits）**
- **DDDの実践**: ドメインモデルの設計パターン習得
- **アーキテクチャパターン**: 企業レベルの設計手法理解
- **バイナリ通信**: 高性能通信プロトコルの実装経験

## 🔧 カスタマイズとメンテナンス

### 1. **新しいタスク属性の追加**

```typescript
// 例: タスクカテゴリの追加

// 1. IDLスキーマ更新 (shared/idl/task.idl)
enum TaskCategory {
  WORK = 0,
  PERSONAL = 1,
  URGENT = 2
}

struct Task {
  // 既存のフィールド...
  TaskCategory category;
}

// 2. ドメインエンティティ更新 (domain/entities/Task.ts)
export class Task {
  constructor(
    // 既存のパラメータ...
    private _category: TaskCategory
  ) {}
  
  get category(): TaskCategory {
    return this._category;
  }
}

// 3. UIコンポーネント更新 (presentation/components/TaskForm.tsx)
const [category, setCategory] = useState<TaskCategory>(TaskCategory.WORK);

// 4. バイナリプロトコル更新 (shared/idl/generator.ts)
// シリアライゼーション/デシリアライゼーション関数を追加
```

### 2. **新しいビジネスルールの追加**

```typescript
// ドメイン層のエンティティに実装
export class Task {
  canBeDeleted(): boolean {
    // ビジネスルール: 進行中のタスクは削除不可
    return !this.isInProgress();
  }
  
  canBeAssigned(userId: string): boolean {
    // ビジネスルール: 完了済みタスクは再アサイン不可
    return !this.isCompleted();
  }
  
  calculatePriorityScore(): number {
    // 優先度と期限からスコア算出
    const priorityWeight = this.priority * 10;
    const daysUntilDue = this.daysUntilDue();
    return priorityWeight + (daysUntilDue < 0 ? 50 : -daysUntilDue);
  }
}
```

### 3. **永続化層の変更**

```typescript
// PostgreSQLRepositoryの実装例
export class PostgreSQLTaskRepository implements ITaskRepository {
  constructor(private connection: Pool) {}
  
  async save(task: Task): Promise<void> {
    const query = `
      INSERT INTO tasks (id, title, description, status, priority, due_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        title = $2, description = $3, status = $4,
        priority = $5, due_date = $6, updated_at = NOW()
    `;
    
    await this.connection.query(query, [
      task.id.value,
      task.title.value,
      task.description.value,
      task.status,
      task.priority,
      task.dueDate
    ]);
  }
}
```

### 4. **通知機能の追加**

```typescript
// ドメインイベントの実装
export class TaskCompletedEvent {
  constructor(
    public readonly taskId: TaskId,
    public readonly completedAt: Date
  ) {}
}

export class Task {
  private domainEvents: DomainEvent[] = [];
  
  markAsCompleted(): void {
    this._status = TaskStatus.COMPLETED;
    this._updatedAt = new Date();
    
    // ドメインイベント発行
    this.domainEvents.push(
      new TaskCompletedEvent(this._id, this._updatedAt)
    );
  }
  
  getEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }
  
  clearEvents(): void {
    this.domainEvents = [];
  }
}
```

## 📋 ベストプラクティス

### 1. **ドメイン駆動設計**
- **ユビキタス言語**: ビジネス用語を統一してコード全体で使用
- **境界づけられたコンテキスト**: 機能領域の明確な分離
- **アグリゲート**: データ整合性の境界を定義

### 2. **レイヤードアーキテクチャ**
- **依存性の方向**: 常に内側（ドメイン）に向かう依存関係
- **インターフェースの活用**: 抽象に依存し、具象に依存しない
- **関心の分離**: 技術的関心事とビジネス関心事の分離

### 3. **コード品質**
- **SOLID原則**: 単一責任、開放閉鎖、リスコフ置換、インターフェース分離、依存性逆転
- **Clean Code**: 読みやすく、理解しやすいコード
- **型安全性**: TypeScriptによる静的型検査の活用

### 4. **パフォーマンス**
- **バイナリ通信**: JSONよりも高速なデータ転送
- **メモリ効率**: 固定サイズ構造体による最適化
- **レスポンシブUI**: React Suspenseとエラーバウンダリの活用

## 🚀 次のステップ

### 学習の発展方向

1. **高度なDDDパターン**
   - ドメインサービス
   - ファクトリパターン
   - スペシフィケーションパターン

2. **アーキテクチャの進化**
   - ヘキサゴナルアーキテクチャ
   - オニオンアーキテクチャ
   - イベント駆動アーキテクチャ

3. **マイクロサービス化**
   - サービス分割戦略
   - API Gateway
   - 分散データ管理

4. **高度なテスト技法**
   - テスト駆動開発（TDD）
   - 振る舞い駆動開発（BDD）
   - プロパティベーステスト

この設計により、実践的なドメイン駆動設計とクリーンアーキテクチャの理解を深めながら、企業レベルのソフトウェア開発スキルを習得できます。