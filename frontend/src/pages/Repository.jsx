import { useState } from "react";
import { useParams } from "react-router-dom";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import DashboardNavbar from "../components/layout/DashboardNavbar";
import RepositoryHeader from "../components/repository/RepositoryHeader";
import RepositorySidebar from "../components/repository/RepositorySidebar";
import CodeViewer from "../components/repository/CodeViewer";
import ChatPanel from "../components/repository/ChatPanel";
import RepositoryStatistics from "../components/repository/RepositoryStatistics";

export default function Repository() {
  const { repositoryId } = useParams();

  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <DashboardNavbar />

      <main className="mx-auto max-w-[1800px] px-6 py-8">
        <RepositoryHeader repositoryId={repositoryId} />

        <div className="mt-8 h-[calc(100vh-230px)]">
          <PanelGroup direction="horizontal" autoSaveId="repository-layout">
            {/* Repository Explorer */}
            <Panel defaultSize={22} minSize={15} maxSize={35}>
              <RepositorySidebar
                repositoryId={repositoryId}
                selectedFileId={selectedFile?.id}
                onFileSelect={setSelectedFile}
              />
            </Panel>

            <PanelResizeHandle className="mx-2 w-1 rounded-full bg-slate-800 transition hover:bg-blue-500" />

            {/* Code Viewer */}
            <Panel defaultSize={53} minSize={35}>
              <CodeViewer
                repositoryId={repositoryId}
                selectedFile={selectedFile}
              />
            </Panel>

            <PanelResizeHandle className="mx-2 w-1 rounded-full bg-slate-800 transition hover:bg-blue-500" />

            {/* AI Chat */}
            <Panel defaultSize={25} minSize={18} maxSize={40}>
              <ChatPanel repositoryId={repositoryId} />
            </Panel>
          </PanelGroup>
        </div>

        <RepositoryStatistics repositoryId={repositoryId} />
      </main>
    </div>
  );
}
