// Binary Structure Validator
// Validates binary structures against their schema definitions

import { ValidationResult, ValidationError, FieldMetadata, StructMetadata } from '../types.js';
import { getStructMetadata, getAllFieldMetadata } from '../decorators/index.js';

/**
 * Validate a struct instance against its binary schema
 */
export function validateStruct<T>(instance: T, StructClass: new () => T): ValidationResult {
  const metadata = getStructMetadata(StructClass);
  if (!metadata) {
    return {
      valid: false,
      errors: [{
        field: 'struct',
        message: `No binary metadata found for ${StructClass.name}`
      }]
    };
  }

  const errors: ValidationError[] = [];
  const fields = getAllFieldMetadata(StructClass);

  // Validate each field
  for (const [propertyKey, field] of fields) {
    const value = (instance as any)[propertyKey];
    const fieldErrors = validateField(propertyKey, value, field);
    errors.push(...fieldErrors);
  }

  // Validate struct constraints
  const structErrors = validateStructConstraints(metadata, fields);
  errors.push(...structErrors);

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a single field
 */
function validateField(propertyKey: string, value: any, field: FieldMetadata): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check required fields
  if (value === undefined || value === null) {
    if (!field.options.nullable) {
      errors.push({
        field: propertyKey,
        message: 'Field is required',
        value
      });
    }
    return errors;
  }

  // Type-specific validation
  switch (field.type) {
    case 'u8':
      errors.push(...validateUnsigned(propertyKey, value, 8));
      break;
    case 'u16':
      errors.push(...validateUnsigned(propertyKey, value, 16));
      break;
    case 'u32':
      errors.push(...validateUnsigned(propertyKey, value, 32));
      break;
    case 'u64':
      errors.push(...validateUnsigned64(propertyKey, value));
      break;
    case 'i8':
      errors.push(...validateSigned(propertyKey, value, 8));
      break;
    case 'i16':
      errors.push(...validateSigned(propertyKey, value, 16));
      break;
    case 'i32':
      errors.push(...validateSigned(propertyKey, value, 32));
      break;
    case 'i64':
      errors.push(...validateSigned64(propertyKey, value));
      break;
    case 'f32':
    case 'f64':
      errors.push(...validateFloat(propertyKey, value));
      break;
    case 'bool':
      errors.push(...validateBoolean(propertyKey, value));
      break;
    case 'string':
      errors.push(...validateString(propertyKey, value, field.options.maxLength || 256));
      break;
    case 'timestamp':
      errors.push(...validateTimestamp(propertyKey, value));
      break;
    case 'enum':
      errors.push(...validateEnum(propertyKey, value, field.options.defaultValue));
      break;
  }

  return errors;
}

/**
 * Validate unsigned integer
 */
function validateUnsigned(field: string, value: any, bits: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof value !== 'number') {
    errors.push({
      field,
      message: `Expected number, got ${typeof value}`,
      value
    });
    return errors;
  }

  if (!Number.isInteger(value)) {
    errors.push({
      field,
      message: 'Value must be an integer',
      value
    });
  }

  if (value < 0) {
    errors.push({
      field,
      message: 'Value must be non-negative',
      value
    });
  }

  const max = Math.pow(2, bits) - 1;
  if (value > max) {
    errors.push({
      field,
      message: `Value exceeds maximum (${max})`,
      value
    });
  }

  return errors;
}

/**
 * Validate unsigned 64-bit integer
 */
function validateUnsigned64(field: string, value: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof value !== 'bigint' && typeof value !== 'number') {
    errors.push({
      field,
      message: `Expected bigint or number, got ${typeof value}`,
      value
    });
    return errors;
  }

  const bigintValue = typeof value === 'bigint' ? value : BigInt(value);

  if (bigintValue < 0n) {
    errors.push({
      field,
      message: 'Value must be non-negative',
      value
    });
  }

  if (bigintValue > 0xFFFFFFFFFFFFFFFFn) {
    errors.push({
      field,
      message: 'Value exceeds 64-bit maximum',
      value
    });
  }

  return errors;
}

/**
 * Validate signed integer
 */
function validateSigned(field: string, value: any, bits: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof value !== 'number') {
    errors.push({
      field,
      message: `Expected number, got ${typeof value}`,
      value
    });
    return errors;
  }

  if (!Number.isInteger(value)) {
    errors.push({
      field,
      message: 'Value must be an integer',
      value
    });
  }

  const min = -Math.pow(2, bits - 1);
  const max = Math.pow(2, bits - 1) - 1;

  if (value < min || value > max) {
    errors.push({
      field,
      message: `Value out of range (${min} to ${max})`,
      value
    });
  }

  return errors;
}

/**
 * Validate signed 64-bit integer
 */
function validateSigned64(field: string, value: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof value !== 'bigint' && typeof value !== 'number') {
    errors.push({
      field,
      message: `Expected bigint or number, got ${typeof value}`,
      value
    });
    return errors;
  }

  const bigintValue = typeof value === 'bigint' ? value : BigInt(value);

  if (bigintValue < -0x8000000000000000n || bigintValue > 0x7FFFFFFFFFFFFFFFn) {
    errors.push({
      field,
      message: 'Value exceeds 64-bit signed range',
      value
    });
  }

  return errors;
}

/**
 * Validate floating point number
 */
function validateFloat(field: string, value: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof value !== 'number') {
    errors.push({
      field,
      message: `Expected number, got ${typeof value}`,
      value
    });
    return errors;
  }

  if (!Number.isFinite(value)) {
    errors.push({
      field,
      message: 'Value must be finite',
      value
    });
  }

  return errors;
}

/**
 * Validate boolean
 */
function validateBoolean(field: string, value: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof value !== 'boolean') {
    errors.push({
      field,
      message: `Expected boolean, got ${typeof value}`,
      value
    });
  }

  return errors;
}

/**
 * Validate string
 */
function validateString(field: string, value: any, maxLength: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof value !== 'string') {
    errors.push({
      field,
      message: `Expected string, got ${typeof value}`,
      value
    });
    return errors;
  }

  if (value.length > maxLength) {
    errors.push({
      field,
      message: `String length exceeds maximum (${maxLength})`,
      value
    });
  }

  // Check for valid UTF-8 encoding
  try {
    new TextEncoder().encode(value);
  } catch (error) {
    errors.push({
      field,
      message: 'String contains invalid UTF-8 characters',
      value
    });
  }

  return errors;
}

/**
 * Validate timestamp
 */
function validateTimestamp(field: string, value: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!(value instanceof Date) && typeof value !== 'number' && typeof value !== 'bigint') {
    errors.push({
      field,
      message: `Expected Date, number, or bigint, got ${typeof value}`,
      value
    });
    return errors;
  }

  let date: Date;
  if (value instanceof Date) {
    date = value;
  } else {
    const timestamp = typeof value === 'bigint' ? Number(value) : value;
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) {
    errors.push({
      field,
      message: 'Invalid timestamp',
      value
    });
  }

  return errors;
}

/**
 * Validate enum value
 */
function validateEnum(field: string, value: any, enumType: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof value !== 'number') {
    errors.push({
      field,
      message: `Expected number for enum, got ${typeof value}`,
      value
    });
    return errors;
  }

  if (enumType && typeof enumType === 'object') {
    const validValues = Object.values(enumType);
    if (!validValues.includes(value)) {
      errors.push({
        field,
        message: `Invalid enum value. Valid values: ${validValues.join(', ')}`,
        value
      });
    }
  }

  return errors;
}

/**
 * Validate struct-level constraints
 */
function validateStructConstraints(metadata: StructMetadata, fields: Map<string, FieldMetadata>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for overlapping fields
  const fieldRanges = Array.from(fields.values()).map(field => ({
    start: field.offset,
    end: field.offset + field.size,
    name: field.propertyKey
  }));

  for (let i = 0; i < fieldRanges.length; i++) {
    for (let j = i + 1; j < fieldRanges.length; j++) {
      const a = fieldRanges[i];
      const b = fieldRanges[j];
      
      if (a.start < b.end && b.start < a.end) {
        errors.push({
          field: 'struct',
          message: `Fields ${a.name} and ${b.name} overlap in memory layout`
        });
      }
    }
  }

  // Check struct size constraints
  if (metadata.options.size) {
    const maxOffset = Math.max(...Array.from(fields.values()).map(f => f.offset + f.size));
    if (maxOffset > metadata.options.size) {
      errors.push({
        field: 'struct',
        message: `Struct size (${maxOffset}) exceeds declared size (${metadata.options.size})`
      });
    }
  }

  return errors;
}

/**
 * Validate buffer size for struct
 */
export function validateBufferSize<T>(buffer: ArrayBuffer, StructClass: new () => T, offset = 0): ValidationResult {
  const metadata = getStructMetadata(StructClass);
  if (!metadata) {
    return {
      valid: false,
      errors: [{
        field: 'buffer',
        message: `No binary metadata found for ${StructClass.name}`
      }]
    };
  }

  const errors: ValidationError[] = [];
  const requiredSize = offset + metadata.totalSize;

  if (buffer.byteLength < requiredSize) {
    errors.push({
      field: 'buffer',
      message: `Buffer too small. Required: ${requiredSize}, actual: ${buffer.byteLength}`
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}