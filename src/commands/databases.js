import { api } from '../lib/api.js';
import chalk from 'chalk';
import ora from 'ora';

export function registerDatabaseCommands(program) {
  const databases = program
    .command('databases')
    .alias('db')
    .description('Manage Notion databases');

  databases
    .command('get <databaseId>')
    .description('Get database details')
    .option('--json', 'Output as JSON')
    .action(async (databaseId, options) => {
      const spinner = ora('Fetching database...').start();
      try {
        const database = await api.getDatabase(databaseId);
        spinner.succeed('Database fetched');

        if (options.json) {
          console.log(JSON.stringify(database, null, 2));
        } else {
          console.log(chalk.cyan('\nDatabase Details:\n'));
          console.log(chalk.bold(database.title?.[0]?.plain_text || 'Untitled'));
          console.log(`  ID: ${database.id}`);
          console.log(`  Created: ${database.created_time}`);
          console.log(`  Last edited: ${database.last_edited_time}`);
          console.log(`  URL: ${chalk.blue(database.url)}`);
          console.log(`\nProperties: ${Object.keys(database.properties || {}).join(', ')}`);
        }
      } catch (error) {
        spinner.fail('Failed to fetch database');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  databases
    .command('query <databaseId>')
    .description('Query database entries')
    .option('--filter <filter>', 'Filter as JSON string')
    .option('--page-size <n>', 'Results per page', '100')
    .option('--json', 'Output as JSON')
    .action(async (databaseId, options) => {
      const spinner = ora('Querying database...').start();
      try {
        const query = {
          page_size: parseInt(options.pageSize)
        };

        if (options.filter) {
          query.filter = JSON.parse(options.filter);
        }

        const result = await api.queryDatabase(databaseId, query);
        spinner.succeed('Database queried');

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(chalk.cyan(`\nTotal results: ${result.results?.length || 0}\n`));
          result.results?.forEach((page, idx) => {
            const title = page.properties?.Name?.title?.[0]?.plain_text ||
                         page.properties?.title?.title?.[0]?.plain_text ||
                         'Untitled';
            console.log(chalk.bold(`${idx + 1}. ${title}`));
            console.log(`   ID: ${page.id}`);
            console.log(`   URL: ${chalk.blue(page.url)}`);
            console.log('');
          });
        }
      } catch (error) {
        spinner.fail('Failed to query database');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  databases
    .command('create')
    .description('Create a new database')
    .requiredOption('--parent-id <id>', 'Parent page ID')
    .option('--title <title>', 'Database title', 'New Database')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const spinner = ora('Creating database...').start();
      try {
        const databaseData = {
          parent: { page_id: options.parentId },
          title: [{ text: { content: options.title } }],
          properties: {
            Name: { title: {} }
          }
        };

        const database = await api.createDatabase(databaseData);
        spinner.succeed('Database created');

        if (options.json) {
          console.log(JSON.stringify(database, null, 2));
        } else {
          console.log(chalk.green('\n✓ Database created successfully!\n'));
          console.log(chalk.bold(options.title));
          console.log(`  ID: ${database.id}`);
          console.log(`  URL: ${chalk.blue(database.url)}`);
        }
      } catch (error) {
        spinner.fail('Failed to create database');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });
}
