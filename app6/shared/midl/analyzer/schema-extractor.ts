// Schema Extractor
// Analyzes TypeScript AST to extract binary schema information

import { StructMetadata, MessageMetadata, FieldMetadata } from '../types.js';
import { STRUCT_METADATA, MESSAGE_METADATA, FIELD_METADATA } from '../types.js';

/**
 * Extract all schema information from loaded modules
 */
export interface SchemaInfo {
  structs: StructMetadata[];
  messages: MessageMetadata[];
  enums: EnumInfo[];
}

export interface EnumInfo {
  name: string;
  values: { [key: string]: number };
  size: number;
}

/**
 * Extract schema information from constructor functions
 */
export function extractSchemaInfo(constructors: Function[]): SchemaInfo {
  const structs: StructMetadata[] = [];
  const messages: MessageMetadata[] = [];
  const enums: EnumInfo[] = [];

  for (const constructor of constructors) {
    // Extract struct metadata
    const structMetadata = STRUCT_METADATA.get(constructor);
    if (structMetadata) {
      structs.push(structMetadata);
    }

    // Extract message metadata
    const messageMetadata = MESSAGE_METADATA.get(constructor);
    if (messageMetadata) {
      messages.push(messageMetadata);
    }
  }

  return { structs, messages, enums };
}

/**
 * Extract schema from a module object
 */
export function extractSchemaFromModule(moduleObject: any): SchemaInfo {
  const constructors: Function[] = [];
  const enums: EnumInfo[] = [];

  for (const [key, value] of Object.entries(moduleObject)) {
    if (typeof value === 'function') {
      constructors.push(value);
    } else if (typeof value === 'object' && value !== null) {
      // Check if it's an enum
      if (isEnumLike(value)) {
        enums.push(extractEnumInfo(key, value));
      }
    }
  }

  const info = extractSchemaInfo(constructors);
  info.enums = enums;
  
  return info;
}

/**
 * Check if an object looks like an enum
 */
function isEnumLike(obj: any): boolean {
  const values = Object.values(obj);
  return values.every(value => typeof value === 'number') &&
         values.length > 0;
}

/**
 * Extract enum information
 */
function extractEnumInfo(name: string, enumObj: any): EnumInfo {
  const values: { [key: string]: number } = {};
  let maxValue = 0;

  for (const [key, value] of Object.entries(enumObj)) {
    if (typeof value === 'number') {
      values[key] = value;
      maxValue = Math.max(maxValue, value);
    }
  }

  // Determine size based on maximum value
  let size = 1;
  if (maxValue > 255) size = 2;
  if (maxValue > 65535) size = 4;
  if (maxValue > 4294967295) size = 8;

  return { name, values, size };
}

/**
 * Calculate memory layout for a struct
 */
export function calculateMemoryLayout(metadata: StructMetadata): MemoryLayout {
  const fields = Array.from(metadata.fields.values());
  
  // Sort fields by offset
  fields.sort((a, b) => a.offset - b.offset);

  const layout: MemoryLayout = {
    totalSize: metadata.totalSize,
    fields: fields.map(field => ({
      name: field.propertyKey,
      type: field.type,
      offset: field.offset,
      size: field.size,
      endOffset: field.offset + field.size
    })),
    gaps: [],
    alignment: metadata.options.align || 1,
    packed: metadata.options.packed || false
  };

  // Calculate gaps between fields
  for (let i = 0; i < layout.fields.length - 1; i++) {
    const current = layout.fields[i];
    const next = layout.fields[i + 1];
    
    if (current.endOffset < next.offset) {
      layout.gaps.push({
        start: current.endOffset,
        end: next.offset,
        size: next.offset - current.endOffset
      });
    }
  }

  // Check for gap at the end
  const lastField = layout.fields[layout.fields.length - 1];
  if (lastField && lastField.endOffset < layout.totalSize) {
    layout.gaps.push({
      start: lastField.endOffset,
      end: layout.totalSize,
      size: layout.totalSize - lastField.endOffset
    });
  }

  return layout;
}

export interface MemoryLayout {
  totalSize: number;
  fields: FieldLayout[];
  gaps: Gap[];
  alignment: number;
  packed: boolean;
}

export interface FieldLayout {
  name: string;
  type: string;
  offset: number;
  size: number;
  endOffset: number;
}

export interface Gap {
  start: number;
  end: number;
  size: number;
}

/**
 * Validate memory layout for potential issues
 */
export function validateMemoryLayout(layout: MemoryLayout): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check for overlapping fields
  for (let i = 0; i < layout.fields.length; i++) {
    for (let j = i + 1; j < layout.fields.length; j++) {
      const a = layout.fields[i];
      const b = layout.fields[j];
      
      if (a.offset < b.endOffset && b.offset < a.endOffset) {
        issues.push({
          type: 'overlap',
          severity: 'error',
          message: `Fields ${a.name} and ${b.name} overlap`,
          field1: a.name,
          field2: b.name
        });
      }
    }
  }

  // Check for alignment issues (if not packed)
  if (!layout.packed) {
    for (const field of layout.fields) {
      const expectedAlignment = getFieldAlignment(field.type);
      if (field.offset % expectedAlignment !== 0) {
        issues.push({
          type: 'alignment',
          severity: 'warning',
          message: `Field ${field.name} is not properly aligned`,
          field1: field.name
        });
      }
    }
  }

  // Check for excessive gaps
  for (const gap of layout.gaps) {
    if (gap.size > 8) {
      issues.push({
        type: 'gap',
        severity: 'warning',
        message: `Large gap (${gap.size} bytes) from offset ${gap.start} to ${gap.end}`,
        field1: `gap_${gap.start}_${gap.end}`
      });
    }
  }

  return issues;
}

export interface ValidationIssue {
  type: 'overlap' | 'alignment' | 'gap';
  severity: 'error' | 'warning';
  message: string;
  field1: string;
  field2?: string;
}

/**
 * Get expected alignment for a field type
 */
function getFieldAlignment(type: string): number {
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
    default:
      return 1;
  }
}

/**
 * Generate a text representation of memory layout
 */
export function formatMemoryLayout(layout: MemoryLayout): string {
  const lines: string[] = [];
  
  lines.push(`Memory Layout (${layout.totalSize} bytes total)`);
  lines.push('─'.repeat(60));
  
  for (const field of layout.fields) {
    const paddingInfo = layout.packed ? '' : ` (align: ${getFieldAlignment(field.type)})`;
    lines.push(`${field.offset.toString().padStart(4)}-${(field.endOffset - 1).toString().padEnd(4)} ${field.name.padEnd(20)} ${field.type}${paddingInfo}`);
  }
  
  if (layout.gaps.length > 0) {
    lines.push('');
    lines.push('Gaps:');
    for (const gap of layout.gaps) {
      lines.push(`${gap.start.toString().padStart(4)}-${(gap.end - 1).toString().padEnd(4)} <gap> (${gap.size} bytes)`);
    }
  }
  
  return lines.join('\n');
}