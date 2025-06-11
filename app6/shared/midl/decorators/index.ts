// MIDL Decorators - Main Export
// TypeScript Decorator-based Binary Interface Definition Language

export * from './binary.js';
export * from './field.js';
export * from './message.js';

// Re-export types for convenience
export * from '../types.js';

// Version information
export const MIDL_VERSION = '1.0.0';

// Utility functions
export { createBinaryView } from '../runtime/binary-view.js';
export { validateStruct } from '../runtime/validator.js';