import Conf from 'conf';
import chalk from 'chalk';

const config = new Conf({ projectName: 'ktmcp-notion' });

export function registerConfigCommands(program) {
  const configCmd = program
    .command('config')
    .description('Manage Notion CLI configuration');

  configCmd
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action((key, value) => {
      config.set(key, value);
      console.log(chalk.green(`✓ Set ${key} = ${value}`));
    });

  configCmd
    .command('get <key>')
    .description('Get a configuration value')
    .action((key) => {
      const value = config.get(key);
      if (value) {
        console.log(chalk.cyan(`${key} = ${value}`));
      } else {
        console.log(chalk.yellow(`${key} is not set`));
      }
    });

  configCmd
    .command('list')
    .description('List all configuration values')
    .action(() => {
      const all = config.store;
      console.log(chalk.cyan('Current configuration:'));
      console.log(JSON.stringify(all, null, 2));
    });

  configCmd
    .command('delete <key>')
    .description('Delete a configuration value')
    .action((key) => {
      config.delete(key);
      console.log(chalk.green(`✓ Deleted ${key}`));
    });
}
