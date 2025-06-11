// Binary View Runtime
// Zero-copy binary data access with type safety

import { BinaryView, FieldMetadata, StructMetadata, Endian } from '../types.js';
import { getStructMetadata, getAllFieldMetadata } from '../decorators/index.js';

/**
 * Base binary view class for zero-copy data access
 */
export class BinaryViewBase implements BinaryView {
  private _buffer: ArrayBuffer;
  private _byteOffset: number;
  private _byteLength: number;
  private _dataView: DataView;

  constructor(buffer: ArrayBuffer, byteOffset = 0, byteLength?: number) {
    this._buffer = buffer;
    this._byteOffset = byteOffset;
    this._byteLength = byteLength ?? buffer.byteLength - byteOffset;
    this._dataView = new DataView(buffer, byteOffset, this._byteLength);
  }

  get buffer(): ArrayBuffer {
    return this._buffer;
  }

  get byteOffset(): number {
    return this._byteOffset;
  }

  get byteLength(): number {
    return this._byteLength;
  }

  get dataView(): DataView {
    return this._dataView;
  }

  toBuffer(): ArrayBuffer {
    return this._buffer.slice(this._byteOffset, this._byteOffset + this._byteLength);
  }

  clone(): BinaryViewBase {
    const newBuffer = this.toBuffer();
    return new BinaryViewBase(newBuffer);
  }

  // Primitive field accessors
  protected getU8(offset: number): number {
    return this._dataView.getUint8(offset);
  }

  protected setU8(offset: number, value: number): void {
    this._dataView.setUint8(offset, value);
  }

  protected getU16(offset: number, littleEndian = true): number {
    return this._dataView.getUint16(offset, littleEndian);
  }

  protected setU16(offset: number, value: number, littleEndian = true): void {
    this._dataView.setUint16(offset, value, littleEndian);
  }

  protected getU32(offset: number, littleEndian = true): number {
    return this._dataView.getUint32(offset, littleEndian);
  }

  protected setU32(offset: number, value: number, littleEndian = true): void {
    this._dataView.setUint32(offset, value, littleEndian);
  }

  protected getU64(offset: number, littleEndian = true): bigint {
    return this._dataView.getBigUint64(offset, littleEndian);
  }

  protected setU64(offset: number, value: bigint, littleEndian = true): void {
    this._dataView.setBigUint64(offset, value, littleEndian);
  }

  protected getI8(offset: number): number {
    return this._dataView.getInt8(offset);
  }

  protected setI8(offset: number, value: number): void {
    this._dataView.setInt8(offset, value);
  }

  protected getI16(offset: number, littleEndian = true): number {
    return this._dataView.getInt16(offset, littleEndian);
  }

  protected setI16(offset: number, value: number, littleEndian = true): void {
    this._dataView.setInt16(offset, value, littleEndian);
  }

  protected getI32(offset: number, littleEndian = true): number {
    return this._dataView.getInt32(offset, littleEndian);
  }

  protected setI32(offset: number, value: number, littleEndian = true): void {
    this._dataView.setInt32(offset, value, littleEndian);
  }

  protected getI64(offset: number, littleEndian = true): bigint {
    return this._dataView.getBigInt64(offset, littleEndian);
  }

  protected setI64(offset: number, value: bigint, littleEndian = true): void {
    this._dataView.setBigInt64(offset, value, littleEndian);
  }

  protected getF32(offset: number, littleEndian = true): number {
    return this._dataView.getFloat32(offset, littleEndian);
  }

  protected setF32(offset: number, value: number, littleEndian = true): void {
    this._dataView.setFloat32(offset, value, littleEndian);
  }

  protected getF64(offset: number, littleEndian = true): number {
    return this._dataView.getFloat64(offset, littleEndian);
  }

  protected setF64(offset: number, value: number, littleEndian = true): void {
    this._dataView.setFloat64(offset, value, littleEndian);
  }

  protected getBool(offset: number): boolean {
    return this._dataView.getUint8(offset) !== 0;
  }

  protected setBool(offset: number, value: boolean): void {
    this._dataView.setUint8(offset, value ? 1 : 0);
  }

  // String field accessors
  protected getString(offset: number, maxLength: number): string {
    const length = this._dataView.getUint16(offset, true);
    const bytes = new Uint8Array(this._buffer, this._byteOffset + offset + 2, length);
    return new TextDecoder().decode(bytes);
  }

  protected setString(offset: number, value: string, maxLength: number): void {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(value);
    const length = Math.min(encoded.length, maxLength);
    
    // Set length
    this._dataView.setUint16(offset, length, true);
    
    // Set string data
    const target = new Uint8Array(this._buffer, this._byteOffset + offset + 2, maxLength);
    target.set(encoded.slice(0, length));
    
    // Clear remaining bytes
    if (length < maxLength) {
      target.fill(0, length);
    }
  }

  // Timestamp accessors (Unix timestamp as u64)
  protected getTimestamp(offset: number, littleEndian = true): Date {
    const timestamp = Number(this._dataView.getBigUint64(offset, littleEndian));
    return new Date(timestamp);
  }

  protected setTimestamp(offset: number, value: Date, littleEndian = true): void {
    const timestamp = BigInt(value.getTime());
    this._dataView.setBigUint64(offset, timestamp, littleEndian);
  }
}

/**
 * Create a binary view instance for a struct
 */
export function createBinaryView<T>(
  StructClass: new () => T,
  buffer: ArrayBuffer,
  offset = 0
): T & BinaryView {
  const metadata = getStructMetadata(StructClass);
  if (!metadata) {
    throw new Error(`No binary metadata found for ${StructClass.name}`);
  }

  const view = new BinaryViewBase(buffer, offset, metadata.totalSize);
  const instance = new StructClass() as any;

  // Add binary view properties
  Object.defineProperty(instance, 'buffer', {
    get: () => view.buffer,
    enumerable: false
  });

  Object.defineProperty(instance, 'byteOffset', {
    get: () => view.byteOffset,
    enumerable: false
  });

  Object.defineProperty(instance, 'byteLength', {
    get: () => view.byteLength,
    enumerable: false
  });

  Object.defineProperty(instance, 'toBuffer', {
    value: () => view.toBuffer(),
    enumerable: false
  });

  Object.defineProperty(instance, 'clone', {
    value: () => createBinaryView(StructClass, view.toBuffer()),
    enumerable: false
  });

  // Add field accessors
  const fields = getAllFieldMetadata(StructClass);
  const littleEndian = metadata.options.endian !== 'big';

  for (const [propertyKey, field] of fields) {
    Object.defineProperty(instance, propertyKey, {
      get: () => getFieldValue(view, field, littleEndian),
      set: (value: any) => setFieldValue(view, field, value, littleEndian),
      enumerable: true,
      configurable: false
    });
  }

  return instance;
}

/**
 * Get field value from binary view
 */
function getFieldValue(view: BinaryViewBase, field: FieldMetadata, littleEndian: boolean): any {
  const { type, primitiveType, offset, options } = field;

  switch (type) {
    case 'u8':
      return view.getU8(offset);
    case 'u16':
      return view.getU16(offset, littleEndian);
    case 'u32':
      return view.getU32(offset, littleEndian);
    case 'u64':
      return view.getU64(offset, littleEndian);
    case 'i8':
      return view.getI8(offset);
    case 'i16':
      return view.getI16(offset, littleEndian);
    case 'i32':
      return view.getI32(offset, littleEndian);
    case 'i64':
      return view.getI64(offset, littleEndian);
    case 'f32':
      return view.getF32(offset, littleEndian);
    case 'f64':
      return view.getF64(offset, littleEndian);
    case 'bool':
      return view.getBool(offset);
    case 'string':
      return view.getString(offset, options.maxLength || 256);
    case 'timestamp':
      return view.getTimestamp(offset, littleEndian);
    case 'enum':
      if (primitiveType === 'u8') return view.getU8(offset);
      if (primitiveType === 'u16') return view.getU16(offset, littleEndian);
      if (primitiveType === 'u32') return view.getU32(offset, littleEndian);
      if (primitiveType === 'u64') return view.getU64(offset, littleEndian);
      return view.getU32(offset, littleEndian);
    default:
      throw new Error(`Unsupported field type: ${type}`);
  }
}

/**
 * Set field value in binary view
 */
function setFieldValue(view: BinaryViewBase, field: FieldMetadata, value: any, littleEndian: boolean): void {
  const { type, primitiveType, offset, options } = field;

  switch (type) {
    case 'u8':
      view.setU8(offset, value);
      break;
    case 'u16':
      view.setU16(offset, value, littleEndian);
      break;
    case 'u32':
      view.setU32(offset, value, littleEndian);
      break;
    case 'u64':
      view.setU64(offset, typeof value === 'bigint' ? value : BigInt(value), littleEndian);
      break;
    case 'i8':
      view.setI8(offset, value);
      break;
    case 'i16':
      view.setI16(offset, value, littleEndian);
      break;
    case 'i32':
      view.setI32(offset, value, littleEndian);
      break;
    case 'i64':
      view.setI64(offset, typeof value === 'bigint' ? value : BigInt(value), littleEndian);
      break;
    case 'f32':
      view.setF32(offset, value, littleEndian);
      break;
    case 'f64':
      view.setF64(offset, value, littleEndian);
      break;
    case 'bool':
      view.setBool(offset, value);
      break;
    case 'string':
      view.setString(offset, value, options.maxLength || 256);
      break;
    case 'timestamp':
      view.setTimestamp(offset, value instanceof Date ? value : new Date(value), littleEndian);
      break;
    case 'enum':
      if (primitiveType === 'u8') view.setU8(offset, value);
      else if (primitiveType === 'u16') view.setU16(offset, value, littleEndian);
      else if (primitiveType === 'u32') view.setU32(offset, value, littleEndian);
      else if (primitiveType === 'u64') view.setU64(offset, typeof value === 'bigint' ? value : BigInt(value), littleEndian);
      else view.setU32(offset, value, littleEndian);
      break;
    default:
      throw new Error(`Unsupported field type: ${type}`);
  }
}

/**
 * Allocate buffer for struct
 */
export function allocateBuffer<T>(StructClass: new () => T): ArrayBuffer {
  const metadata = getStructMetadata(StructClass);
  if (!metadata) {
    throw new Error(`No binary metadata found for ${StructClass.name}`);
  }
  
  return new ArrayBuffer(metadata.totalSize);
}