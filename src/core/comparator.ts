import { DirectoryTree, TreeGenerator } from './tree-generator';
import { FileParser } from './file-parser';

export class DirectoryComparator {
  static compare(
    dir1Path: string,
    dir2Path: string
  ): {
    identical: boolean;
    differences: string[];
  } {
    const tree1 = TreeGenerator.generateTree(dir1Path);
    const tree2 = TreeGenerator.generateTree(dir2Path);

    return FileParser.compareTrees(tree1, tree2);
  }

  static findDifferences(
    tree1: DirectoryTree,
    tree2: DirectoryTree
  ): {
    added: DirectoryTree[];
    removed: DirectoryTree[];
    modified: DirectoryTree[];
  } {
    const result = {
      added: [] as DirectoryTree[],
      removed: [] as DirectoryTree[],
      modified: [] as DirectoryTree[],
    };

    const findDifferencesRecursive = (node1?: DirectoryTree, node2?: DirectoryTree) => {
      if (!node1 && node2) {
        result.added.push(node2);
        return;
      }
      if (node1 && !node2) {
        result.removed.push(node1);
        return;
      }

      if (!node1 || !node2) {
        return;
      }

      if (
        node1.type !== node2.type ||
        node1.name !== node2.name ||
        (node1.type === 'file' && node2.type === 'file')
      ) {
        result.modified.push(node2);
        return;
      }

      const node1Children = node1.children || [];
      const node2Children = node2.children || [];

      const maxChildrenLength = Math.max(node1Children.length, node2Children.length);

      for (let i = 0; i < maxChildrenLength; i++) {
        findDifferencesRecursive(node1Children[i], node2Children[i]);
      }
    };

    findDifferencesRecursive(tree1, tree2);

    return result;
  }
}
