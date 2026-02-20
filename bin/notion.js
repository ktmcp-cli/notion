#!/usr/bin/env node

/**
 * Notion CLI - Main Entry Point
 *
 * Production-ready CLI for Notion API
 * Productivity and notes management
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

// Import command modules
import { registerPageCommands } from '../src/commands/pages.js';
import { registerDatabaseCommands } from '../src/commands/databases.js';
import { registerBlockCommands } from '../src/commands/blocks.js';
import { registerSearchCommands } from '../src/commands/search.js';
import { registerConfigCommands } from '../src/commands/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

// Configure main program
program
  .name('notion')
  .description(chalk.cyan('Notion API CLI - Productivity and notes management'))
  .version(packageJson.version, '-v, --version', 'output the current version')
  .addHelpText('after', `
${chalk.bold('Examples:')}
  $ notion config set apiToken <your-token>
  $ notion pages list
  $ notion pages get <page-id>
  $ notion databases query <database-id>
  $ notion search "meeting notes"

${chalk.bold('API Documentation:')}
  ${chalk.blue('https://developers.notion.com/')}

${chalk.bold('Get API Token:')}
  ${chalk.blue('https://www.notion.so/my-integrations')}
`);

// Register all command modules
registerConfigCommands(program);
registerPageCommands(program);
registerDatabaseCommands(program);
registerBlockCommands(program);
registerSearchCommands(program);

// Global error handler
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);
