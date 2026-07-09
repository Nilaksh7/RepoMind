import { useState } from "react";

import DashboardNavbar from "../components/layout/DashboardNavbar";
import SearchBar from "../components/dashboard/SearchBar";
import ImportRepositoryModal from "../components/dashboard/ImportRepositoryModal";
import RepositoryGrid from "../components/dashboard/RepositoryGrid";

export default function Dashboard() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [repositoryRefreshKey, setRepositoryRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <DashboardNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <SearchBar onImportRepository={() => setIsImportModalOpen(true)} />

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Your Repositories</h2>

          <p className="mt-2 text-slate-400">
            Manage and explore your imported GitHub repositories.
          </p>

          <RepositoryGrid refreshKey={repositoryRefreshKey} />
        </section>
      </main>

      <ImportRepositoryModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => {
          setRepositoryRefreshKey((current) => current + 1);
        }}
      />
    </div>
  );
}
