import React from "react";
import { Divider, Modal as ModalAntd } from "antd";
import styles from "../styles/modal.module.scss";
import { MdClose } from "react-icons/md";

export interface ModalComponentProps {
  title: string;
  children?: React.ReactNode;
  open?: boolean;
  modalStyle?: React.CSSProperties;
  onClose?: () => void;
  closeOnOutsideClick?: boolean;
  width?: number;
  showCloseIcon?: boolean;
  centered?: boolean;
  destroyOnClose?: boolean;
}

const Modal: React.FC<ModalComponentProps> = ({
  title,
  children,
  modalStyle,
  open = false,
  onClose,
  closeOnOutsideClick,
  width,
  showCloseIcon = true,
  centered,
}) => {
  return (
    <>
      <ModalAntd
        wrapClassName="ms--modal-container"
        style={{ top: 20, minHeight: "30vh", height: "30vh", ...modalStyle }}
        width={width}
        open={open}
        footer={null}
        title={
          <div className={styles["ms--modal-header"]}>
            <span>{title}</span>
            <Divider />
          </div>
        }
        closeIcon={<MdClose className={styles["ms--close-icon"]} />}
        onCancel={closeOnOutsideClick ? onClose : onClose}
        closable={showCloseIcon}
        centered={centered}
      >
        {children}
      </ModalAntd>
    </>
  );
};

export default Modal;
