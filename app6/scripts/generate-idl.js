#!/usr/bin/env node
// IDL Code Generation Script
// Generates TypeScript binary view classes from MIDL schemas

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runCli } from '../shared/midl/tools/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

async function generateIdlCode() {
  console.log('🚀 Generating MIDL code...\n');
  
  const inputFile = join(projectRoot, 'schemas', 'task.binary.ts');
  const outputFile = join(projectRoot, 'shared', 'generated', 'task.generated.ts');
  
  try {
    // Generate TypeScript code
    await runCli({
      command: 'generate',
      input: inputFile,
      output: outputFile,
      format: 'typescript',
      verbose: true
    });
    
    console.log('\n✅ MIDL code generation completed successfully!');
    
    // Optionally run validation
    console.log('\n🔍 Running validation...');
    await runCli({
      command: 'validate',
      input: inputFile,
      verbose: true
    });
    
  } catch (error) {
    console.error('\n❌ MIDL code generation failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateIdlCode();
}