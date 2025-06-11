// TypeScript Code Generator
// Generates TypeScript binary view classes and utilities

import { StructMetadata, MessageMetadata, FieldMetadata } from '../types.js';
import { SchemaInfo, MemoryLayout, calculateMemoryLayout } from '../analyzer/schema-extractor.js';

/**
 * Generate TypeScript code for all schemas
 */
export function generateTypeScript(schemaInfo: SchemaInfo): GeneratedCode {
  const imports = generateImports();
  const structs = schemaInfo.structs.map(generateStructCode).join('\n\n');
  const messages = schemaInfo.messages.map(generateMessageCode).join('\n\n');
  const utilities = generateUtilities(schemaInfo);

  return {
    content: [imports, structs, messages, utilities].filter(Boolean).join('\n\n'),
    filename: 'generated.ts'
  };
}

export interface GeneratedCode {
  content: string;
  filename: string;
}

/**
 * Generate import statements
 */
function generateImports(): string {
  return `// Auto-generated TypeScript binary views
// DO NOT EDIT - Generated from MIDL schema

import { BinaryViewBase, createBinaryView, allocateBuffer } from '../shared/midl/runtime/index.js';
import { BinaryView } from '../shared/midl/types.js';`;
}

/**
 * Generate code for a struct
 */
function generateStructCode(metadata: StructMetadata): string {
  const className = `${metadata.name}BinaryView`;
  const layout = calculateMemoryLayout(metadata);
  
  const fields = Array.from(metadata.fields.values());
  const fieldAccessors = fields.map(field => generateFieldAccessor(field, metadata)).join('\n\n  ');
  
  const staticInfo = generateStaticInfo(metadata, layout);
  
  return `/**
 * Binary view for ${metadata.name}
 * Total size: ${metadata.totalSize} bytes
 */
export class ${className} extends BinaryViewBase {
  ${staticInfo}

  constructor(buffer: ArrayBuffer, byteOffset = 0) {
    super(buffer, byteOffset, ${metadata.totalSize});
  }

  ${fieldAccessors}

  /**
   * Create from plain object
   */
  static fromObject(obj: Partial<${metadata.name}Data>): ${className} {
    const buffer = allocateBuffer(${metadata.name});
    const view = new ${className}(buffer);
    
    ${fields.map(field => `if (obj.${field.propertyKey} !== undefined) view.${field.propertyKey} = obj.${field.propertyKey};`).join('\n    ')}
    
    return view;
  }

  /**
   * Convert to plain object
   */
  toObject(): ${metadata.name}Data {
    return {
      ${fields.map(field => `${field.propertyKey}: this.${field.propertyKey}`).join(',\n      ')}
    };
  }

  /**
   * Clone this view
   */
  clone(): ${className} {
    return new ${className}(this.toBuffer());
  }
}

/**
 * Data interface for ${metadata.name}
 */
export interface ${metadata.name}Data {
  ${fields.map(field => `${field.propertyKey}: ${getTypeScriptType(field)};`).join('\n  ')}
}`;
}

/**
 * Generate static information for struct
 */
function generateStaticInfo(metadata: StructMetadata, layout: MemoryLayout): string {
  const fields = Array.from(metadata.fields.values());
  
  return `static readonly SIZE = ${metadata.totalSize};
  static readonly LAYOUT = ${JSON.stringify({
    totalSize: layout.totalSize,
    packed: layout.packed,
    alignment: layout.alignment
  }, null, 2)} as const;
  
  static readonly OFFSETS = {
    ${fields.map(field => `${field.propertyKey}: ${field.offset}`).join(',\n    ')}
  } as const;

  static readonly FIELD_SIZES = {
    ${fields.map(field => `${field.propertyKey}: ${field.size}`).join(',\n    ')}
  } as const;`;
}

/**
 * Generate field accessor methods
 */
function generateFieldAccessor(field: FieldMetadata, structMetadata: StructMetadata): string {
  const isLittleEndian = structMetadata.options.endian !== 'big';
  const endianParam = isLittleEndian ? 'true' : 'false';
  
  switch (field.type) {
    case 'u8':
      return `get ${field.propertyKey}(): number {
    return this.getU8(${field.offset});
  }

  set ${field.propertyKey}(value: number) {
    this.setU8(${field.offset}, value);
  }`;

    case 'u16':
      return `get ${field.propertyKey}(): number {
    return this.getU16(${field.offset}, ${endianParam});
  }

  set ${field.propertyKey}(value: number) {
    this.setU16(${field.offset}, value, ${endianParam});
  }`;

    case 'u32':
      return `get ${field.propertyKey}(): number {
    return this.getU32(${field.offset}, ${endianParam});
  }

  set ${field.propertyKey}(value: number) {
    this.setU32(${field.offset}, value, ${endianParam});
  }`;

    case 'u64':
      return `get ${field.propertyKey}(): bigint {
    return this.getU64(${field.offset}, ${endianParam});
  }

  set ${field.propertyKey}(value: bigint) {
    this.setU64(${field.offset}, value, ${endianParam});
  }`;

    case 'i8':
      return `get ${field.propertyKey}(): number {
    return this.getI8(${field.offset});
  }

  set ${field.propertyKey}(value: number) {
    this.setI8(${field.offset}, value);
  }`;

    case 'i16':
      return `get ${field.propertyKey}(): number {
    return this.getI16(${field.offset}, ${endianParam});
  }

  set ${field.propertyKey}(value: number) {
    this.setI16(${field.offset}, value, ${endianParam});
  }`;

    case 'i32':
      return `get ${field.propertyKey}(): number {
    return this.getI32(${field.offset}, ${endianParam});
  }

  set ${field.propertyKey}(value: number) {
    this.setI32(${field.offset}, value, ${endianParam});
  }`;

    case 'i64':
      return `get ${field.propertyKey}(): bigint {
    return this.getI64(${field.offset}, ${endianParam});
  }

  set ${field.propertyKey}(value: bigint) {
    this.setI64(${field.offset}, value, ${endianParam});
  }`;

    case 'f32':
      return `get ${field.propertyKey}(): number {
    return this.getF32(${field.offset}, ${endianParam});
  }

  set ${field.propertyKey}(value: number) {
    this.setF32(${field.offset}, value, ${endianParam});
  }`;

    case 'f64':
      return `get ${field.propertyKey}(): number {
    return this.getF64(${field.offset}, ${endianParam});
  }

  set ${field.propertyKey}(value: number) {
    this.setF64(${field.offset}, value, ${endianParam});
  }`;

    case 'bool':
      return `get ${field.propertyKey}(): boolean {
    return this.getBool(${field.offset});
  }

  set ${field.propertyKey}(value: boolean) {
    this.setBool(${field.offset}, value);
  }`;

    case 'string':
      const maxLength = field.options.maxLength || 256;
      return `get ${field.propertyKey}(): string {
    return this.getString(${field.offset}, ${maxLength});
  }

  set ${field.propertyKey}(value: string) {
    this.setString(${field.offset}, value, ${maxLength});
  }`;

    case 'timestamp':
      return `get ${field.propertyKey}(): Date {
    return this.getTimestamp(${field.offset}, ${endianParam});
  }

  set ${field.propertyKey}(value: Date) {
    this.setTimestamp(${field.offset}, value, ${endianParam});
  }`;

    case 'enum':
      const enumSize = field.primitiveType?.replace(/[ui]/, '') || '32';
      const enumGetter = `getU${enumSize}`;
      const enumSetter = `setU${enumSize}`;
      return `get ${field.propertyKey}(): number {
    return this.${enumGetter}(${field.offset}${enumSize !== '8' ? `, ${endianParam}` : ''});
  }

  set ${field.propertyKey}(value: number) {
    this.${enumSetter}(${field.offset}, value${enumSize !== '8' ? `, ${endianParam}` : ''});
  }`;

    default:
      return `// TODO: Implement accessor for ${field.type}`;
  }
}

/**
 * Generate code for a message
 */
function generateMessageCode(metadata: MessageMetadata): string {
  // Messages are treated as structs with header/payload separation
  return `// Message: ${metadata.name} (Type: ${metadata.options.type})
// TODO: Implement message-specific serialization`;
}

/**
 * Generate utility functions
 */
function generateUtilities(schemaInfo: SchemaInfo): string {
  const structNames = schemaInfo.structs.map(s => s.name);
  
  return `/**
 * Utility functions
 */
export const BinaryViews = {
  ${structNames.map(name => `${name}: ${name}BinaryView`).join(',\n  ')}
} as const;

/**
 * Create binary view factory
 */
export function createView<T extends keyof typeof BinaryViews>(
  type: T,
  buffer: ArrayBuffer,
  offset = 0
): InstanceType<typeof BinaryViews[T]> {
  return new BinaryViews[type](buffer, offset) as InstanceType<typeof BinaryViews[T]>;
}

/**
 * Allocate buffer for struct type
 */
export function allocateFor<T extends keyof typeof BinaryViews>(type: T): ArrayBuffer {
  return new ArrayBuffer(BinaryViews[type].SIZE);
}`;
}

/**
 * Get TypeScript type for field
 */
function getTypeScriptType(field: FieldMetadata): string {
  switch (field.type) {
    case 'u8':
    case 'u16':
    case 'u32':
    case 'i8':
    case 'i16':
    case 'i32':
    case 'f32':
    case 'f64':
    case 'enum':
      return 'number';
    case 'u64':
    case 'i64':
      return 'bigint';
    case 'bool':
      return 'boolean';
    case 'string':
      return 'string';
    case 'timestamp':
      return 'Date';
    default:
      return 'any';
  }
}