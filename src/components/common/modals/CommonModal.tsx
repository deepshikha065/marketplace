import type { ReactNode } from "react";
import Modal from "react-bootstrap/Modal";
import "./CommonModal.scss";
const CommonModal = ({
  show,
  onHide,
  heading,
  children,
  className,
  headerHide,
  headingContent,
  backdrop,
  keyboard,
  noCross,
  size,
}: {
  show?: boolean;
  onHide?: () => void;
  heading?: string;
  children?: ReactNode;
  className?: string;
  headerHide?: string;
  headingContent?: string;
  backdrop?: boolean | "static";
  keyboard?: boolean;
  noCross?: boolean;
  size?: 'sm' | 'lg' | 'xl';
}) => {

  return (
    <Modal
      centered
      show={show}
      onHide={onHide}
      className={`common_modal ${className || ""}`}
      backdrop={backdrop}
      keyboard={keyboard}
      size={size}
    >
      {headerHide ? null : (
        <Modal.Header
          closeButton={noCross}
          className={heading ? "" : `${noCross === false ? "cross-only" : ""}`}
        >
          {heading ? <Modal.Title>{heading}</Modal.Title> : headingContent}
        </Modal.Header>
      )}
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};
export default CommonModal;
