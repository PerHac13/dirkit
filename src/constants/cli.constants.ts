// src/types/cli-constants.ts
import colors from 'colors';

export interface ICliOptions {
  arg: string[];
  description: string;
  name: string;
}

export const OPTIONS: ICliOptions[] = [
  {
    arg: ['-d', '--depth'],
    description: 'Set maximum depth for directory tree generation (default: infinite)',
    name: 'depth',
  },
  {
    arg: ['-e', '--exclude'],
    description: 'Exclude specific directories or patterns (comma-separated)',
    name: 'exclude',
  },
  {
    arg: ['-j', '--json'],
    description: 'Export directory tree to JSON file',
    name: 'json-export',
  },
  {
    arg: ['-c', '--compare'],
    description: 'Compare two directory trees',
    name: 'compare',
  },
  {
    arg: ['-f', '--filter'],
    description: 'Apply filters to directory tree (type, size, name)',
    name: 'filter',
  },
  {
    arg: ['-s', '--sort'],
    description: 'Sort directory tree by: size, name, or modification time',
    name: 'sort',
  },
  {
    arg: ['-t', '--type'],
    description: 'Filter by file/directory type (file, directory)',
    name: 'type-filter',
  },
  {
    arg: ['-m', '--min-size'],
    description: 'Minimum file size for filtering (in bytes)',
    name: 'min-size',
  },
  {
    arg: ['-x', '--exclude-hidden'],
    description: 'Exclude hidden files and directories',
    name: 'exclude-hidden',
  },
  {
    arg: ['-h', '--help'],
    description: 'Show help information',
    name: 'help',
  },
  {
    arg: ['-v', '--version'],
    description: 'Show version information',
    name: 'version',
  },
];

export const HELP_HEADER = `
Dirkit: A Powerful Directory Tree Management Tool

 ┌------ FEATURES --------------------
 🭲 Generate comprehensive directory trees
 🭲 Compare directory structures
 🭲 Advanced filtering and sorting
 🭲 JSON export capabilities
`;

export const HELP_CONTROLS = `
 ┌------ CONTROLS --------------------
 🭲 --depth:         Control tree generation depth
 🭲 --exclude:       Ignore specific directories
 🭲 --json:          Export tree to JSON
 🭲 --compare:       Compare directory structures
 🭲 --filter:        Apply advanced filters
`;

export const HELP_EXAMPLES = `
 ┌------ EXAMPLES --------------------
 🭲 dirkit generate ./project -d 2 
 🭲 dirkit compare ./dir1 ./dir2
 🭲 dirkit generate ./project -j tree.json
 🭲 dirkit generate ./project -f --type file --min-size 1000
`;

export const HELP_FOOTER = `
Dirkit helps you understand, manage, and analyze your project's directory structure 
with ease and precision. Use with care and creativity!
`;

export const COLORS = {
  success: colors.green,
  error: colors.red,
  warning: colors.yellow,
  info: colors.blue,
};

export const COLOR_THEMES = {
  default: 'blue',
  available: ['blue', 'cyan', 'magenta', 'red', 'white', 'yellow'],
};

export const ERROR_MESSAGES = {
  DIRECTORY_NOT_FOUND: 'Error: Specified directory does not exist',
  INVALID_DEPTH: 'Error: Depth must be a positive number',
  COMPARE_FAILED: 'Error: Directory comparison failed',
  JSON_EXPORT_ERROR: 'Error: Failed to export JSON',
  FILTER_ERROR: 'Error: Invalid filter parameters',
};
