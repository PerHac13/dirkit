import * as fs from 'fs';
import * as path from 'path';

export interface DirectoryTree {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: DirectoryTree[];
  size?: number;
}

export interface TreeGeneratorOptions {
  depth?: number;
  exclude?: string[];
  includeFiles?: boolean;
}

export class TreeGenerator {
  static generateTree(dirPath: string, options: TreeGeneratorOptions = {}): DirectoryTree {
    const {
      depth = Infinity,
      exclude = ['node_modules', '.git', '.DS_Store'],
      includeFiles = true,
    } = options;

    const generateNode = (currentPath: string, currentDepth: number): DirectoryTree | null => {
      if (currentDepth > depth || exclude.some((ex) => currentPath.includes(ex))) {
        return null;
      }

      const nodeName = path.basename(currentPath);
      const stats = fs.statSync(currentPath);

      if (stats.isFile() && !includeFiles) {
        return null;
      }

      const node: DirectoryTree = {
        name: nodeName,
        type: stats.isDirectory() ? 'directory' : 'file',
        path: currentPath,
        size: stats.size,
      };

      if (stats.isDirectory()) {
        const children: DirectoryTree[] = [];

        try {
          const file = fs.readdirSync(currentPath);

          file.forEach((file) => {
            const fullPath = path.join(currentPath, file);
            const childNode = generateNode(fullPath, currentDepth + 1);

            if (childNode) {
              children.push(childNode);
            }
          });

          if (children.length) {
            node.children = children;
          }
        } catch (error) {
          console.warn(`Could not read directory ${currentPath}: `, error);
        }
      }

      return node;
    };

    const rootNode = generateNode(dirPath, 0);

    if (!rootNode) {
      throw new Error('Could not generate tree for root directory');
    }

    return rootNode;
  }

  static exportToJson(tree: DirectoryTree): string {
    return JSON.stringify(tree, null, 2);
  }
}
