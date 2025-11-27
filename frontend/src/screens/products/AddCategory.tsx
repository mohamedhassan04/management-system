import React from "react";
import Modal from "../../components/Modal";
import styles from "../../styles/clients.module.scss";

interface AddCategoryProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  return (
    <Modal
      title={
        <div className={styles["ms--modal-title-icon"]}>
          <div></div>
          <span>Ajouter une catégorie</span>
        </div>
      }
      open={isModalOpen}
      onClose={setIsModalOpen}
      closeOnOutsideClick={true}
      width={550}
      modalStyle={{ top: -120 }}
      centered={true}
    ></Modal>
  );
};

export default AddCategory;
