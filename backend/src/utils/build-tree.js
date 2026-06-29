function buildNestedRepositoryTree(entries) {
  const nodesByPath = new Map();
  const roots = [];

  // First pass: create every node
  for (const entry of entries) {
    const node =
      entry.type === "directory"
        ? {
            name: entry.name,
            path: entry.path,
            type: entry.type,
            children: [],
          }
        : {
            name: entry.name,
            path: entry.path,
            type: entry.type,
            extension: entry.extension,
          };

    nodesByPath.set(entry.path, node);
  }

  // Second pass: attach nodes to their parents
  for (const entry of entries) {
    const node = nodesByPath.get(entry.path);

    if (entry.parent_path === null) {
      roots.push(node);
      continue;
    }

    const parent = nodesByPath.get(entry.parent_path);

    if (parent && parent.type === "directory") {
      parent.children.push(node);
    } else {
      // Parent missing, treat as root
      roots.push(node);
    }
  }

  return roots;
}

module.exports = {
  buildNestedRepositoryTree,
};
