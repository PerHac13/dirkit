export class TreeFormatter {
  static toAsciiTree(tree: any): string {
    // Helper function to recursively build the tree
    const buildTreeString = (
      node: any,
      prefix: string = "",
      isLast: boolean = true,
    ) => {
      let result = "";

      // Determine the current node's display name
      const nodeName = node.type === "directory" ? `${node.name}/` : node.name;

      // Add the current node
      result += `${prefix}${isLast ? "└── " : "├── "}${nodeName}\n`;

      // If it's a directory and has children, process them
      if (node.children && node.children.length > 0) {
        const newPrefix = prefix + (isLast ? "    " : "│   ");

        node.children.forEach((child: any, index: number) => {
          const isLastChild = index === node.children.length - 1;
          result += buildTreeString(child, newPrefix, isLastChild);
        });
      }

      return result;
    };

    // Remove the trailing newline and return
    return buildTreeString(tree).trimEnd();
  }
}
