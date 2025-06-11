#!/usr/bin/env node
// MIDL CLI Tool
// Command-line interface for MIDL schema operations

import { extractSchemaFromModule, calculateMemoryLayout, formatMemoryLayout, validateMemoryLayout } from '../analyzer/schema-extractor.js';
import { generateTypeScript } from '../generators/typescript-generator.js';

/**
 * CLI Commands
 */
export interface CliOptions {
  command: 'analyze' | 'generate' | 'validate' | 'visualize';
  input: string;
  output?: string;
  format?: 'typescript' | 'cpp' | 'python';
  verbose?: boolean;
}

/**
 * Main CLI entry point
 */
export async function runCli(options: CliOptions): Promise<void> {
  try {
    switch (options.command) {
      case 'analyze':
        await analyzeSchema(options);
        break;
      case 'generate':
        await generateCode(options);
        break;
      case 'validate':
        await validateSchema(options);
        break;
      case 'visualize':
        await visualizeSchema(options);
        break;
      default:
        console.error(`Unknown command: ${options.command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

/**
 * Analyze schema command
 */
async function analyzeSchema(options: CliOptions): Promise<void> {
  console.log(`Analyzing schema from ${options.input}...`);
  
  // Dynamic import of the schema module
  const module = await import(options.input);
  const schemaInfo = extractSchemaFromModule(module);
  
  console.log('\n📋 Schema Analysis Report');
  console.log('=' .repeat(50));
  
  // Structs
  if (schemaInfo.structs.length > 0) {
    console.log(`\n🏗️  Structs (${schemaInfo.structs.length}):`);
    for (const struct of schemaInfo.structs) {
      console.log(`  • ${struct.name} (${struct.totalSize} bytes)`);
      if (options.verbose) {
        console.log(`    Fields: ${struct.fields.size}`);
        console.log(`    Packed: ${struct.options.packed ? 'Yes' : 'No'}`);
        console.log(`    Endian: ${struct.options.endian || 'little'}`);
      }
    }
  }
  
  // Messages
  if (schemaInfo.messages.length > 0) {
    console.log(`\n📨 Messages (${schemaInfo.messages.length}):`);
    for (const message of schemaInfo.messages) {
      console.log(`  • ${message.name} (Type: 0x${message.options.type?.toString(16) || '00'})`);
      if (options.verbose) {
        console.log(`    Header fields: ${message.headerFields.size}`);
        console.log(`    Payload fields: ${message.payloadFields.size}`);
      }
    }
  }
  
  // Enums
  if (schemaInfo.enums.length > 0) {
    console.log(`\n🔢 Enums (${schemaInfo.enums.length}):`);
    for (const enumInfo of schemaInfo.enums) {
      console.log(`  • ${enumInfo.name} (${enumInfo.size} bytes)`);
      if (options.verbose) {
        const values = Object.entries(enumInfo.values)
          .map(([key, value]) => `${key}=${value}`)
          .join(', ');
        console.log(`    Values: ${values}`);
      }
    }
  }
}

/**
 * Generate code command
 */
async function generateCode(options: CliOptions): Promise<void> {
  console.log(`Generating ${options.format || 'typescript'} code from ${options.input}...`);
  
  const module = await import(options.input);
  const schemaInfo = extractSchemaFromModule(module);
  
  let generated: { content: string; filename: string };
  
  switch (options.format || 'typescript') {
    case 'typescript':
      generated = generateTypeScript(schemaInfo);
      break;
    default:
      throw new Error(`Unsupported format: ${options.format}`);
  }
  
  if (options.output) {
    // Write to file
    const fs = await import('fs/promises');
    await fs.writeFile(options.output, generated.content, 'utf8');
    console.log(`✅ Generated code written to ${options.output}`);
  } else {
    // Output to console
    console.log('\n📄 Generated Code:');
    console.log('=' .repeat(50));
    console.log(generated.content);
  }
}

/**
 * Validate schema command
 */
async function validateSchema(options: CliOptions): Promise<void> {
  console.log(`Validating schema from ${options.input}...`);
  
  const module = await import(options.input);
  const schemaInfo = extractSchemaFromModule(module);
  
  let hasErrors = false;
  let hasWarnings = false;
  
  console.log('\n🔍 Validation Report');
  console.log('=' .repeat(50));
  
  for (const struct of schemaInfo.structs) {
    const layout = calculateMemoryLayout(struct);
    const issues = validateMemoryLayout(layout);
    
    if (issues.length > 0) {
      console.log(`\n⚠️  ${struct.name}:`);
      for (const issue of issues) {
        const icon = issue.severity === 'error' ? '❌' : '⚠️ ';
        console.log(`  ${icon} ${issue.message}`);
        
        if (issue.severity === 'error') hasErrors = true;
        if (issue.severity === 'warning') hasWarnings = true;
      }
    } else {
      console.log(`✅ ${struct.name}: No issues found`);
    }
  }
  
  console.log('\n📊 Summary:');
  if (hasErrors) {
    console.log('❌ Validation failed with errors');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('⚠️  Validation completed with warnings');
  } else {
    console.log('✅ All schemas are valid');
  }
}

/**
 * Visualize schema command
 */
async function visualizeSchema(options: CliOptions): Promise<void> {
  console.log(`Visualizing schema from ${options.input}...`);
  
  const module = await import(options.input);
  const schemaInfo = extractSchemaFromModule(module);
  
  console.log('\n🎨 Memory Layout Visualization');
  console.log('=' .repeat(60));
  
  for (const struct of schemaInfo.structs) {
    console.log(`\n📐 ${struct.name}:`);
    console.log('-' .repeat(40));
    
    const layout = calculateMemoryLayout(struct);
    const visualization = formatMemoryLayout(layout);
    console.log(visualization);
    
    // Add visual representation
    console.log('\nMemory Map:');
    generateMemoryMap(layout);
  }
}

/**
 * Generate ASCII memory map
 */
function generateMemoryMap(layout: any): void {
  const bytesPerRow = 16;
  const totalRows = Math.ceil(layout.totalSize / bytesPerRow);
  
  console.log('    ' + Array.from({ length: bytesPerRow }, (_, i) => 
    i.toString(16).padStart(2, '0')).join(' '));
  console.log('    ' + '── '.repeat(bytesPerRow));
  
  for (let row = 0; row < totalRows; row++) {
    const rowOffset = row * bytesPerRow;
    const rowStr = rowOffset.toString(16).padStart(4, '0') + '│';
    
    const bytes: string[] = [];
    for (let col = 0; col < bytesPerRow; col++) {
      const byteOffset = rowOffset + col;
      if (byteOffset >= layout.totalSize) {
        bytes.push('  ');
        continue;
      }
      
      // Find field that contains this byte
      const field = layout.fields.find((f: any) => 
        byteOffset >= f.offset && byteOffset < f.endOffset);
      
      if (field) {
        const fieldChar = field.name[0].toUpperCase();
        bytes.push(fieldChar + ' ');
      } else {
        bytes.push('░░');
      }
    }
    
    console.log(rowStr + bytes.join(''));
  }
  
  // Legend
  console.log('\nLegend:');
  for (const field of layout.fields) {
    const char = field.name[0].toUpperCase();
    console.log(`  ${char} = ${field.name} (${field.size} bytes)`);
  }
  console.log('  ░ = unused/padding');
}

/**
 * Parse command line arguments
 */
export function parseArgs(args: string[]): CliOptions {
  const options: Partial<CliOptions> = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case 'analyze':
      case 'generate':
      case 'validate':
      case 'visualize':
        options.command = arg;
        break;
      case '-i':
      case '--input':
        options.input = args[++i];
        break;
      case '-o':
      case '--output':
        options.output = args[++i];
        break;
      case '-f':
      case '--format':
        options.format = args[++i] as any;
        break;
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;
      case '-h':
      case '--help':
        printHelp();
        process.exit(0);
        break;
      default:
        if (!options.input && !arg.startsWith('-')) {
          options.input = arg;
        }
        break;
    }
  }
  
  if (!options.command) {
    throw new Error('Command is required. Use --help for usage information.');
  }
  
  if (!options.input) {
    throw new Error('Input file is required.');
  }
  
  return options as CliOptions;
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
MIDL CLI Tool - TypeScript Decorator-based Binary IDL

Usage:
  midl <command> [options]

Commands:
  analyze     Analyze schema and show statistics
  generate    Generate code from schema
  validate    Validate schema for issues
  visualize   Show memory layout visualization

Options:
  -i, --input <file>     Input schema file
  -o, --output <file>    Output file (default: stdout)
  -f, --format <format>  Output format (typescript, cpp, python)
  -v, --verbose          Verbose output
  -h, --help             Show this help

Examples:
  midl analyze schemas/task.binary.ts
  midl generate -i schemas/task.binary.ts -o generated/task.generated.ts
  midl validate schemas/task.binary.ts
  midl visualize schemas/task.binary.ts -v
`);
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    printHelp();
    process.exit(1);
  }
  
  try {
    const options = parseArgs(args);
    await runCli(options);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}