import * as fs from 'fs';
import * as path from 'path';
import { DirectoryTree } from './tree-generator';

export class FileParser {
  static parseTree(
    tree: DirectoryTree,
    filterFunction?: (node: DirectoryTree) => boolean
  ): DirectoryTree {
    if (!filterFunction) return tree;

    const filterNode = (node: DirectoryTree): DirectoryTree | null => {
      if (!filterFunction(node)) return null;

      const filteredNode = { ...node };

      if (filteredNode.children) {
        filteredNode.children = filteredNode.children
          .map(filterNode)
          .filter(Boolean) as DirectoryTree[];
      }

      return filteredNode;
    };

    return (
      filterNode(tree) || {
        name: 'Empty',
        type: 'directory',
        path: '',
      }
    );
  }

  static compareTrees(
    tree1: DirectoryTree,
    tree2: DirectoryTree
  ): {
    identical: boolean;
    differences: string[];
  } {
    const differences: string[] = [];
    const compareNodes = (
      node1: DirectoryTree,
      node2: DirectoryTree,
      currentPath = ''
    ): boolean => {
      if (node1.type !== node2.type) {
        differences.push(`Type mismatch at ${currentPath}`);
        return false;
      }

      if (node1.name !== node2.name) {
        differences.push(`Name mismatch at ${currentPath}`);
        return false;
      }

      if (node1.type !== node2.type) {
        differences.push(`File type mismatch for ${currentPath}`);
        return false;
      }

      if (node1.children && node2.children) {
        if (node1.children.length !== node2.children.length) {
          differences.push(`Child count mismatch at ${currentPath}`);
          return false;
        }

        return node1.children.every((child1, index) =>
          compareNodes(child1, node2.children![index], path.join(currentPath, child1.name))
        );
      }

      return true;
    };

    const identical = compareNodes(tree1, tree2);

    return { identical, differences };
  }

  static saveTreeToFile(tree: DirectoryTree, outputPath: string): void {
    const jsonTree = JSON.stringify(tree, null, 2);
    fs.writeFileSync(outputPath, jsonTree);
  }
}
