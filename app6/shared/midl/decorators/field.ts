// Binary Field Decorators
// Defines binary field types and layouts

import { FieldType, FieldOptions, FieldMetadata, FIELD_METADATA, PrimitiveType } from '../types.js';

/**
 * Field decorator factory
 */
function createFieldDecorator(
  type: FieldType,
  primitiveType: PrimitiveType | undefined,
  defaultSize: number,
  offset?: number,
  options: FieldOptions = {}
) {
  return function (target: any, propertyKey: string) {
    const constructor = target.constructor;
    
    if (!FIELD_METADATA.has(constructor)) {
      FIELD_METADATA.set(constructor, new Map());
    }
    
    const fields = FIELD_METADATA.get(constructor)!;
    
    // Calculate offset if not provided
    const finalOffset = offset ?? calculateNextOffset(fields);
    
    const metadata: FieldMetadata = {
      propertyKey,
      type,
      primitiveType,
      offset: finalOffset,
      size: options.length || defaultSize,
      options: { ...options }
    };
    
    fields.set(propertyKey, metadata);
  };
}

/**
 * Calculate next available offset
 */
function calculateNextOffset(fields: Map<string, FieldMetadata>): number {
  if (fields.size === 0) return 0;
  
  return Array.from(fields.values())
    .reduce((max, field) => Math.max(max, field.offset + field.size), 0);
}

/**
 * Field namespace with typed field decorators
 */
export namespace Field {
  // Unsigned integers
  export function u8(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('u8', 'u8', 1, offset, options);
  }

  export function u16(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('u16', 'u16', 2, offset, options);
  }

  export function u32(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('u32', 'u32', 4, offset, options);
  }

  export function u64(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('u64', 'u64', 8, offset, options);
  }

  // Signed integers
  export function i8(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('i8', 'i8', 1, offset, options);
  }

  export function i16(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('i16', 'i16', 2, offset, options);
  }

  export function i32(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('i32', 'i32', 4, offset, options);
  }

  export function i64(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('i64', 'i64', 8, offset, options);
  }

  // Floating point
  export function f32(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('f32', 'f32', 4, offset, options);
  }

  export function f64(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('f64', 'f64', 8, offset, options);
  }

  // Boolean
  export function bool(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('bool', 'bool', 1, offset, options);
  }

  // String with fixed maximum length
  export function string(offset?: number, optionsOrMaxLength?: FieldOptions | number) {
    const options = typeof optionsOrMaxLength === 'number' 
      ? { maxLength: optionsOrMaxLength }
      : optionsOrMaxLength || {};
    
    const maxLength = options.maxLength || 256;
    // Size = length field (2 bytes) + max string data
    const size = 2 + maxLength;
    
    return createFieldDecorator('string', undefined, size, offset, options);
  }

  // Timestamp (stored as u64 Unix timestamp)
  export function timestamp(offset?: number, options?: FieldOptions) {
    return createFieldDecorator('timestamp', 'u64', 8, offset, options);
  }

  // Enum field
  export function enumField<T extends Record<string, number>>(
    enumType: T,
    offset?: number,
    options?: FieldOptions & { size?: 1 | 2 | 4 }
  ) {
    const size = options?.size || 4; // Default to u32 for enums
    return createFieldDecorator('enum', `u${size * 8}` as PrimitiveType, size, offset, {
      ...options,
      defaultValue: enumType
    });
  }

  // Array field
  export function array<T>(
    elementType: FieldType,
    length: number,
    offset?: number,
    options?: FieldOptions & { elementSize?: number }
  ) {
    const elementSize = options?.elementSize || getTypeSize(elementType);
    const totalSize = 4 + (elementSize * length); // count (4 bytes) + elements
    
    return createFieldDecorator('array', undefined, totalSize, offset, {
      ...options,
      length
    });
  }

  // Custom field with explicit size
  export function custom(
    type: FieldType,
    size: number,
    offset?: number,
    options?: FieldOptions
  ) {
    return createFieldDecorator(type, undefined, size, offset, options);
  }
}

/**
 * Get type size in bytes
 */
function getTypeSize(type: FieldType): number {
  switch (type) {
    case 'u8':
    case 'i8':
    case 'bool':
      return 1;
    case 'u16':
    case 'i16':
      return 2;
    case 'u32':
    case 'i32':
    case 'f32':
      return 4;
    case 'u64':
    case 'i64':
    case 'f64':
    case 'timestamp':
      return 8;
    case 'string':
      return 256; // Default string size
    default:
      return 4; // Default size
  }
}

/**
 * Get field metadata for a property
 */
export function getFieldMetadata(constructor: Function, propertyKey: string): FieldMetadata | undefined {
  const fields = FIELD_METADATA.get(constructor);
  return fields?.get(propertyKey);
}

/**
 * Get all field metadata for a constructor
 */
export function getAllFieldMetadata(constructor: Function): Map<string, FieldMetadata> {
  return FIELD_METADATA.get(constructor) || new Map();
}