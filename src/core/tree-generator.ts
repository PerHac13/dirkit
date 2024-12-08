import * as fs from 'fs';
import * as path from 'path';

export interface DirectoryTree {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: DirectoryTree[];
  // size?: number;
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
      // console.log({ depth, exclude, includeFiles });
      // Check depth first
      if (currentDepth > depth) {
        return null;
      }

      // Get the base name of the current path
      const nodeName = path.basename(currentPath);

      // Check if the current node should be excluded
      if (exclude.some((ex) => nodeName === ex)) {
        console.log('Excluding: ', nodeName);
        return null;
      }

      const stats = fs.statSync(currentPath);

      if (stats.isFile() && !includeFiles) {
        return null;
      }

      const node: DirectoryTree = {
        name: nodeName,
        type: stats.isDirectory() ? 'directory' : 'file',
        path: currentPath,
      };

      if (stats.isDirectory()) {
        const children: DirectoryTree[] = [];

        try {
          const files = fs.readdirSync(currentPath);

          files.forEach((file) => {
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
