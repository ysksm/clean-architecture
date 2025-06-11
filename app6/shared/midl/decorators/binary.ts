// Binary Structure Decorators
// Defines binary layout and structure options

import { StructOptions, StructMetadata, STRUCT_METADATA, FIELD_METADATA } from '../types.js';

/**
 * Binary structure decorator
 * Marks a class as a binary structure with specific layout options
 */
export function Binary(options: StructOptions = {}) {
  return function <T extends new (...args: any[]) => {}>(constructor: T) {
    const fields = FIELD_METADATA.get(constructor) || new Map();
    
    // Calculate total size if not specified
    let totalSize = options.size || 0;
    if (!totalSize && fields.size > 0) {
      totalSize = Array.from(fields.values())
        .reduce((max, field) => Math.max(max, field.offset + field.size), 0);
    }

    const metadata: StructMetadata = {
      name: constructor.name,
      constructor,
      options,
      fields,
      totalSize
    };

    STRUCT_METADATA.set(constructor, metadata);
    
    return constructor;
  };
}

/**
 * Binary namespace with utility decorators
 */
export namespace Binary {
  /**
   * Packed structure (no padding between fields)
   */
  export function packed(options: Omit<StructOptions, 'packed'> = {}) {
    return Binary({ ...options, packed: true });
  }

  /**
   * Structure with specific size
   */
  export function size(bytes: number, options: Omit<StructOptions, 'size'> = {}) {
    return Binary({ ...options, size: bytes });
  }

  /**
   * Structure with specific alignment
   */
  export function align(bytes: number, options: Omit<StructOptions, 'align'> = {}) {
    return Binary({ ...options, align: bytes });
  }

  /**
   * Structure with specific endianness
   */
  export function endian(endian: 'little' | 'big', options: Omit<StructOptions, 'endian'> = {}) {
    return Binary({ ...options, endian });
  }

  /**
   * Little endian structure
   */
  export function littleEndian(options: Omit<StructOptions, 'endian'> = {}) {
    return Binary({ ...options, endian: 'little' });
  }

  /**
   * Big endian structure
   */
  export function bigEndian(options: Omit<StructOptions, 'endian'> = {}) {
    return Binary({ ...options, endian: 'big' });
  }

  /**
   * Versioned structure
   */
  export function version(version: string, options: Omit<StructOptions, 'version'> = {}) {
    return Binary({ ...options, version });
  }

  /**
   * Structure with packed layout and specific size
   */
  export function struct(options: StructOptions) {
    return Binary(options);
  }
}

/**
 * Get structure metadata
 */
export function getStructMetadata(constructor: Function): StructMetadata | undefined {
  return STRUCT_METADATA.get(constructor);
}

/**
 * Check if a class is a binary structure
 */
export function isBinaryStruct(constructor: Function): boolean {
  return STRUCT_METADATA.has(constructor);
}