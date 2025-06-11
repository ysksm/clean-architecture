// MIDL (Memory-mapped IDL) Type Definitions
// TypeScript Decorator-based Binary Interface Definition Language

export type PrimitiveType = 
  | 'u8' | 'u16' | 'u32' | 'u64'
  | 'i8' | 'i16' | 'i32' | 'i64'
  | 'f32' | 'f64'
  | 'bool';

export type FieldType = 
  | PrimitiveType
  | 'string'
  | 'timestamp'
  | 'enum'
  | 'struct'
  | 'array';

export interface FieldOptions {
  offset?: number;
  maxLength?: number;
  length?: number;
  defaultValue?: any;
  nullable?: boolean;
  endian?: 'little' | 'big';
}

export interface StructOptions {
  packed?: boolean;
  size?: number;
  align?: number;
  endian?: 'little' | 'big';
  version?: string;
}

export interface MessageOptions {
  type?: number;
  version?: number;
}

export interface FieldMetadata {
  propertyKey: string;
  type: FieldType;
  primitiveType?: PrimitiveType;
  offset: number;
  size: number;
  options: FieldOptions;
}

export interface StructMetadata {
  name: string;
  constructor: Function;
  options: StructOptions;
  fields: Map<string, FieldMetadata>;
  totalSize: number;
}

export interface MessageMetadata {
  name: string;
  constructor: Function;
  options: MessageOptions;
  headerFields: Map<string, FieldMetadata>;
  payloadFields: Map<string, FieldMetadata>;
}

// グローバルメタデータストレージ
export const STRUCT_METADATA = new Map<Function, StructMetadata>();
export const MESSAGE_METADATA = new Map<Function, MessageMetadata>();
export const FIELD_METADATA = new Map<Function, Map<string, FieldMetadata>>();

// エンディアネス
export enum Endian {
  Little = 'little',
  Big = 'big'
}

// バイナリビューの基底インターフェース
export interface BinaryView {
  readonly buffer: ArrayBuffer;
  readonly byteOffset: number;
  readonly byteLength: number;
  
  toBuffer(): ArrayBuffer;
  clone(): BinaryView;
}

// バリデーション結果
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}