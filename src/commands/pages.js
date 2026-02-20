import { api } from '../lib/api.js';
import chalk from 'chalk';
import ora from 'ora';

export function registerPageCommands(program) {
  const pages = program
    .command('pages')
    .alias('p')
    .description('Manage Notion pages');

  pages
    .command('get <pageId>')
    .description('Get page details')
    .option('--json', 'Output as JSON')
    .action(async (pageId, options) => {
      const spinner = ora('Fetching page...').start();
      try {
        const page = await api.getPage(pageId);
        spinner.succeed('Page fetched');

        if (options.json) {
          console.log(JSON.stringify(page, null, 2));
        } else {
          console.log(chalk.cyan('\nPage Details:\n'));
          console.log(chalk.bold(page.properties?.title?.title?.[0]?.plain_text || 'Untitled'));
          console.log(`  ID: ${page.id}`);
          console.log(`  Created: ${page.created_time}`);
          console.log(`  Last edited: ${page.last_edited_time}`);
          console.log(`  Archived: ${page.archived}`);
          console.log(`  URL: ${chalk.blue(page.url)}`);
        }
      } catch (error) {
        spinner.fail('Failed to fetch page');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  pages
    .command('create')
    .description('Create a new page')
    .requiredOption('--parent-id <id>', 'Parent page or database ID')
    .option('--title <title>', 'Page title', 'Untitled')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const spinner = ora('Creating page...').start();
      try {
        const pageData = {
          parent: { page_id: options.parentId },
          properties: {
            title: {
              title: [{ text: { content: options.title } }]
            }
          }
        };

        const page = await api.createPage(pageData);
        spinner.succeed('Page created');

        if (options.json) {
          console.log(JSON.stringify(page, null, 2));
        } else {
          console.log(chalk.green('\n✓ Page created successfully!\n'));
          console.log(chalk.bold(options.title));
          console.log(`  ID: ${page.id}`);
          console.log(`  URL: ${chalk.blue(page.url)}`);
        }
      } catch (error) {
        spinner.fail('Failed to create page');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  pages
    .command('update <pageId>')
    .description('Update page properties')
    .option('--title <title>', 'New page title')
    .option('--json', 'Output as JSON')
    .action(async (pageId, options) => {
      const spinner = ora('Updating page...').start();
      try {
        const pageData = {};

        if (options.title) {
          pageData.properties = {
            title: {
              title: [{ text: { content: options.title } }]
            }
          };
        }

        const page = await api.updatePage(pageId, pageData);
        spinner.succeed('Page updated');

        if (options.json) {
          console.log(JSON.stringify(page, null, 2));
        } else {
          console.log(chalk.green('\n✓ Page updated successfully!\n'));
          console.log(`  ID: ${page.id}`);
        }
      } catch (error) {
        spinner.fail('Failed to update page');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  pages
    .command('archive <pageId>')
    .description('Archive a page')
    .action(async (pageId) => {
      const spinner = ora('Archiving page...').start();
      try {
        await api.archivePage(pageId);
        spinner.succeed(chalk.green(`✓ Page ${pageId} archived`));
      } catch (error) {
        spinner.fail('Failed to archive page');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });
}
