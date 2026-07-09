import Modal from "../ui/Modal";
import RepositoryReadme from "./RepositoryReadme";

export default function RepositoryReadmeModal({
  isOpen,
  onClose,
  repositoryId,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Repository README"
      maxWidth="max-w-6xl"
    >
      <RepositoryReadme repositoryId={repositoryId} />
    </Modal>
  );
}
