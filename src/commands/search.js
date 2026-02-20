import { api } from '../lib/api.js';
import chalk from 'chalk';
import ora from 'ora';

export function registerSearchCommands(program) {
  program
    .command('search [query]')
    .description('Search Notion workspace')
    .option('--type <type>', 'Filter by type (page, database)')
    .option('--json', 'Output as JSON')
    .action(async (query = '', options) => {
      const spinner = ora('Searching...').start();
      try {
        const filter = {};
        if (options.type) {
          filter.value = options.type;
          filter.property = 'object';
        }

        const result = await api.search(query, filter);
        spinner.succeed('Search completed');

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(chalk.cyan(`\nTotal results: ${result.results?.length || 0}\n`));
          result.results?.forEach((item, idx) => {
            const title = item.properties?.title?.title?.[0]?.plain_text ||
                         item.title?.[0]?.plain_text ||
                         'Untitled';
            console.log(chalk.bold(`${idx + 1}. ${title}`));
            console.log(`   Type: ${item.object}`);
            console.log(`   ID: ${item.id}`);
            console.log(`   URL: ${chalk.blue(item.url)}`);
            console.log('');
          });
        }
      } catch (error) {
        spinner.fail('Search failed');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });
}
