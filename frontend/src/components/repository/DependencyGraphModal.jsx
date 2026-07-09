import Modal from "../ui/Modal";
import DependencyGraph from "./DependencyGraph";

export default function DependencyGraphModal({
  isOpen,
  onClose,
  repositoryId,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Repository Dependency Graph"
      maxWidth="max-w-7xl"
    >
      <DependencyGraph repositoryId={repositoryId} />
    </Modal>
  );
}
