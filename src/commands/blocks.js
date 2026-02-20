import { api } from '../lib/api.js';
import chalk from 'chalk';
import ora from 'ora';

export function registerBlockCommands(program) {
  const blocks = program
    .command('blocks')
    .alias('b')
    .description('Manage Notion blocks');

  blocks
    .command('get <blockId>')
    .description('Get block details')
    .option('--json', 'Output as JSON')
    .action(async (blockId, options) => {
      const spinner = ora('Fetching block...').start();
      try {
        const block = await api.getBlock(blockId);
        spinner.succeed('Block fetched');

        if (options.json) {
          console.log(JSON.stringify(block, null, 2));
        } else {
          console.log(chalk.cyan('\nBlock Details:\n'));
          console.log(`  ID: ${block.id}`);
          console.log(`  Type: ${block.type}`);
          console.log(`  Created: ${block.created_time}`);
          console.log(`  Has children: ${block.has_children}`);
        }
      } catch (error) {
        spinner.fail('Failed to fetch block');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  blocks
    .command('children <blockId>')
    .description('Get block children')
    .option('--page-size <n>', 'Results per page', '100')
    .option('--json', 'Output as JSON')
    .action(async (blockId, options) => {
      const spinner = ora('Fetching children...').start();
      try {
        const result = await api.getBlockChildren(blockId, {
          page_size: parseInt(options.pageSize)
        });
        spinner.succeed('Children fetched');

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(chalk.cyan(`\nTotal children: ${result.results?.length || 0}\n`));
          result.results?.forEach((block, idx) => {
            console.log(`${idx + 1}. Type: ${block.type} | ID: ${block.id}`);
          });
        }
      } catch (error) {
        spinner.fail('Failed to fetch children');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  blocks
    .command('append <blockId>')
    .description('Append children to a block')
    .requiredOption('--text <text>', 'Text content to append')
    .option('--json', 'Output as JSON')
    .action(async (blockId, options) => {
      const spinner = ora('Appending block...').start();
      try {
        const blocks = [{
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: options.text } }]
          }
        }];

        const result = await api.appendBlockChildren(blockId, blocks);
        spinner.succeed('Block appended');

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(chalk.green('\n✓ Block appended successfully!'));
        }
      } catch (error) {
        spinner.fail('Failed to append block');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  blocks
    .command('delete <blockId>')
    .description('Delete a block')
    .action(async (blockId) => {
      const spinner = ora('Deleting block...').start();
      try {
        await api.deleteBlock(blockId);
        spinner.succeed(chalk.green(`✓ Block ${blockId} deleted`));
      } catch (error) {
        spinner.fail('Failed to delete block');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });
}
