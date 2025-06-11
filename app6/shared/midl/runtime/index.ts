// MIDL Runtime - Main Export
// Runtime support for TypeScript Decorator-based Binary IDL

export * from './binary-view.js';
export * from './validator.js';

// Utility functions
export { createBinaryView, allocateBuffer } from './binary-view.js';
export { validateStruct, validateBufferSize } from './validator.js';