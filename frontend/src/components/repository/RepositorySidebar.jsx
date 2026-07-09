import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";

import {
  getRepositoryTree,
  searchRepository,
} from "../../services/repository.service";

import TreeNode from "./TreeNode";
import SemanticSearchResults from "./SemanticSearchResults";

function filterTree(nodes, query) {
  if (!query) {
    return nodes;
  }

  const search = query.toLowerCase();

  return nodes.reduce((result, node) => {
    const matches = node.name.toLowerCase().includes(search);

    if (node.type === "directory") {
      const filteredChildren = filterTree(node.children || [], query);

      if (matches || filteredChildren.length > 0) {
        result.push({
          ...node,
          children: filteredChildren,
        });
      }
    } else if (matches) {
      result.push(node);
    }

    return result;
  }, []);
}

export default function RepositorySidebar({
  repositoryId,
  selectedFileId,
  onFileSelect,
}) {
  const [tree, setTree] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [semanticResults, setSemanticResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRepositoryTree();
  }, [repositoryId]);

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      setSemanticResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError("");

        const response = await searchRepository(repositoryId, query);

        setSemanticResults(response.results);
      } catch (error) {
        setSearchError(
          error.response?.data?.message ||
            error.message ||
            "Semantic search failed.",
        );
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [repositoryId, searchQuery]);

  async function loadRepositoryTree() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getRepositoryTree(repositoryId);

      setTree(response.tree);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load repository tree.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const filteredTree = useMemo(
    () => filterTree(tree, searchQuery.trim()),
    [tree, searchQuery],
  );

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-5">
        <h2 className="font-semibold text-white">Repository Explorer</h2>

        <div className="relative mt-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search files or code..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isSearching && (
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
            <Loader2 size={15} className="animate-spin" />
            Searching...
          </div>
        )}

        {searchError && (
          <p className="mb-4 text-sm text-red-400">{searchError}</p>
        )}

        <SemanticSearchResults
          results={semanticResults}
          onFileSelect={onFileSelect}
        />
        {isLoading && (
          <p className="text-sm text-slate-400">Loading repository...</p>
        )}

        {!isLoading && error && <p className="text-sm text-red-400">{error}</p>}

        {!isLoading && !error && filteredTree.length === 0 && (
          <p className="text-sm text-slate-400">
            {searchQuery ? "No matching files found." : "Repository is empty."}
          </p>
        )}

        {!isLoading &&
          !error &&
          filteredTree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              selectedFileId={selectedFileId}
              onFileSelect={onFileSelect}
              searchQuery={searchQuery}
            />
          ))}
      </div>
    </aside>
  );
}
