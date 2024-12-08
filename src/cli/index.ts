import { program } from 'commander';
import { TreeGenerator } from '../core/tree-generator';
import { FileParser } from '../core/file-parser';
import { DirectoryComparator } from '../core/comparator';
import {
  OPTIONS,
  HELP_HEADER,
  HELP_CONTROLS,
  HELP_EXAMPLES,
  HELP_FOOTER,
  COLORS,
  ERROR_MESSAGES,
} from '../constants/cli.constants';

import * as path from 'path';
import * as fs from 'fs';
import { TreeFormatter } from '../utils/tree-formater';

const packageJson = require('../../package.json');

export class DirkitCLI {
  static init() {
    // Configure program with custom help
    program.name('dirkit').description(HELP_HEADER.trim()).version(packageJson.version);

    // Dynamically add options from constants
    OPTIONS.forEach((option) => {
      // const mainArg = option.arg[0];

      program.option(option.arg.join(', '), option.description);
    });

    program
      .command('generate [directory]')
      .description('Generate a directory tree')
      .option('-j, --json', 'Output in JSON format')
      .option('-d, --depth <depth>', 'Limit directory depth')
      .option('-e, --exclude <dirs>', 'Comma-separated list of directories to exclude')
      .option('--exclude-hidden', 'Exclude hidden files and directories')
      .action((directory = '.', options) => {
        try {
          const resolvedPath = path.resolve(directory);

          // Validate directory exists
          if (!fs.existsSync(resolvedPath)) {
            console.error(COLORS.error(ERROR_MESSAGES.DIRECTORY_NOT_FOUND));
            process.exit(1);
          }

          // Prepare tree generation options
          const treeOptions = {
            depth: options.depth ? Number(options.depth) : Infinity,
            exclude: options.exclude
              ? options.exclude.split(/\s*,\s*/).filter((dir: string) => dir.trim() !== '')
              : undefined,
            includeFiles: options.excludeHidden ? false : true,
          };
          // console.log(treeOptions);
          // Generate tree
          const tree = TreeGenerator.generateTree(resolvedPath, treeOptions);
          if (options.json) {
            const jsonOutput = TreeGenerator.exportToJson(tree);
            if (typeof options.json === 'string') {
              const outputPath = path.resolve(options.json);
              fs.writeFileSync(outputPath, jsonOutput);
              console.log(COLORS.success(`Tree exported to ${outputPath}`));
            } else {
              console.log(jsonOutput);
            }
          } else {
            console.log(TreeFormatter.toAsciiTree(tree));
          }
        } catch (error) {
          console.error(COLORS.error('Error generating tree:'), error);
          process.exit(1);
        }
      });

    // Compare Directories Command
    program
      .command('compare <dir1> <dir2>')
      .description('Compare two directories')
      .action((dir1, dir2, options) => {
        try {
          const resolvedDir1 = path.resolve(dir1);
          const resolvedDir2 = path.resolve(dir2);

          // Validate directories exist
          [resolvedDir1, resolvedDir2].forEach((dir) => {
            if (!fs.existsSync(dir)) {
              console.error(COLORS.error(ERROR_MESSAGES.DIRECTORY_NOT_FOUND));
              process.exit(1);
            }
          });

          const tree1 = TreeGenerator.generateTree(resolvedDir1);
          const tree2 = TreeGenerator.generateTree(resolvedDir2);

          const { identical, differences } = FileParser.compareTrees(tree1, tree2);

          if (identical) {
            console.log(COLORS.success('Directories are identical.'));
          } else {
            console.log(COLORS.warning('Directories have differences.'));

            if (options.detailed) {
              console.log('\nDifferences:');
              differences.forEach((diff) => console.log(COLORS.error(`- ${diff}`)));

              // Detailed breakdown
              const detailedDiff = DirectoryComparator.findDifferences(tree1, tree2);
              console.log('\nDetailed Differences:');
              console.log(
                'Added:',
                detailedDiff.added.map((item) => item.path)
              );
              console.log(
                'Removed:',
                detailedDiff.removed.map((item) => item.path)
              );
              console.log(
                'Modified:',
                detailedDiff.modified.map((item) => item.path)
              );
            }
          }
        } catch (error) {
          console.error(COLORS.error(ERROR_MESSAGES.COMPARE_FAILED), error);
          process.exit(1);
        }
      });

    // Custom help
    program.on('--help', () => {
      console.log(HELP_CONTROLS);
      console.log(HELP_EXAMPLES);
      console.log(HELP_FOOTER);
    });

    // Parse arguments
    program.parse(process.argv);

    // Show help if no command is provided
    if (!process.argv.slice(2).length) {
      program.outputHelp();
    }
  }
}
