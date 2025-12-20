import React from "react";
import Modal from "../../components/Modal";
import styles from "../../styles/clients.module.scss";

interface ViewInvoiceProps {
  pdfUrl: string | null;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ViewInvoice: React.FC<ViewInvoiceProps> = ({
  pdfUrl,
  isOpen,
  setIsOpen,
}) => {
  return (
    <Modal
      title={
        <div className={styles["ms--modal-title-icon"]}>
          <div></div>
          <span>Voir la facture</span>
        </div>
      }
      open={isOpen}
      onClose={() => setIsOpen(false)}
      closeOnOutsideClick={true}
      width={900}
      modalStyle={{ top: -250 }}
      centered={true}
    >
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          style={{ border: "none", borderRadius: 8 }}
        ></iframe>
      )}
    </Modal>
  );
};

export default ViewInvoice;
