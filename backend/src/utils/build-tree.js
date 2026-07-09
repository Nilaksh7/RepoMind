function buildNestedRepositoryTree(entries) {
  const nodesByPath = new Map();
  const roots = [];

  // Create every node
  for (const entry of entries) {
    const node =
      entry.type === "directory"
        ? {
            id: entry.id,
            name: entry.name,
            path: entry.path,
            type: entry.type,
            children: [],
          }
        : {
            id: entry.id,
            name: entry.name,
            path: entry.path,
            type: entry.type,
            extension: entry.extension,
          };

    nodesByPath.set(entry.path, node);
  }

  // Attach nodes to parents
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
      roots.push(node);
    }
  }

  return roots;
}

module.exports = {
  buildNestedRepositoryTree,
};
