// Message Decorators
// Defines binary message formats with headers and payloads

import { MessageOptions, MessageMetadata, MESSAGE_METADATA, FieldMetadata, FIELD_METADATA } from '../types.js';

/**
 * Message decorator for request/response structures
 */
export function Message(options: MessageOptions = {}) {
  return function <T extends new (...args: any[]) => {}>(constructor: T) {
    const fields = FIELD_METADATA.get(constructor) || new Map();
    
    // Separate header and payload fields
    const headerFields = new Map<string, FieldMetadata>();
    const payloadFields = new Map<string, FieldMetadata>();
    
    for (const [key, field] of fields) {
      if (field.options.defaultValue === 'header') {
        headerFields.set(key, field);
      } else {
        payloadFields.set(key, field);
      }
    }

    const metadata: MessageMetadata = {
      name: constructor.name,
      constructor,
      options,
      headerFields,
      payloadFields
    };

    MESSAGE_METADATA.set(constructor, metadata);
    
    return constructor;
  };
}

/**
 * Message namespace with utility decorators
 */
export namespace Message {
  /**
   * Request message with specific type
   */
  export function request(type: number, options: Omit<MessageOptions, 'type'> = {}) {
    return Message({ ...options, type });
  }

  /**
   * Response message with specific type
   */
  export function response(type: number, options: Omit<MessageOptions, 'type'> = {}) {
    return Message({ ...options, type });
  }

  /**
   * Versioned message
   */
  export function version(version: number, options: Omit<MessageOptions, 'version'> = {}) {
    return Message({ ...options, version });
  }
}

/**
 * Header field decorator
 */
export function Header() {
  return function (target: any, propertyKey: string) {
    const constructor = target.constructor;
    
    if (!FIELD_METADATA.has(constructor)) {
      FIELD_METADATA.set(constructor, new Map());
    }
    
    const fields = FIELD_METADATA.get(constructor)!;
    
    // Mark field as header field
    const existing = fields.get(propertyKey);
    if (existing) {
      existing.options.defaultValue = 'header';
    }
  };
}

/**
 * Payload field decorator
 */
export function Payload() {
  return function (target: any, propertyKey: string) {
    const constructor = target.constructor;
    
    if (!FIELD_METADATA.has(constructor)) {
      FIELD_METADATA.set(constructor, new Map());
    }
    
    const fields = FIELD_METADATA.get(constructor)!;
    
    // Mark field as payload field
    const existing = fields.get(propertyKey);
    if (existing) {
      existing.options.defaultValue = 'payload';
    }
  };
}

/**
 * Message header decorator with standard fields
 */
export function MessageHeader(messageType: number) {
  return function <T extends new (...args: any[]) => {}>(constructor: T) {
    // Add standard header fields
    const fields = FIELD_METADATA.get(constructor) || new Map();
    
    // Message type field
    fields.set('messageType', {
      propertyKey: 'messageType',
      type: 'u32',
      primitiveType: 'u32',
      offset: 0,
      size: 4,
      options: { defaultValue: messageType }
    });
    
    // Message size field
    fields.set('messageSize', {
      propertyKey: 'messageSize',
      type: 'u32',
      primitiveType: 'u32',
      offset: 4,
      size: 4,
      options: {}
    });
    
    FIELD_METADATA.set(constructor, fields);
    
    return constructor;
  };
}

/**
 * Get message metadata
 */
export function getMessageMetadata(constructor: Function): MessageMetadata | undefined {
  return MESSAGE_METADATA.get(constructor);
}

/**
 * Check if a class is a message
 */
export function isMessage(constructor: Function): boolean {
  return MESSAGE_METADATA.has(constructor);
}