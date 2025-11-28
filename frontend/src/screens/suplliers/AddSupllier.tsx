import React from "react";
import styles from "../../styles/clients.module.scss";
import { Col, Divider, Form, Row } from "antd";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { RiSave2Fill } from "react-icons/ri";
import Modal from "../../components/Modal";

interface AddSupllierProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  handleAddSupllier: (values: any) => void;
  form: any;
  loading?: boolean;
}

const AddSupllier: React.FC<AddSupllierProps> = ({
  isModalOpen,
  setIsModalOpen,
  handleAddSupllier,
  form,
  loading,
}) => {
  return (
    <Modal
      title={
        <div className={styles["ms--modal-title-icon"]}>
          <div></div>
          <span>Ajouter un fournisseur</span>
        </div>
      }
      open={isModalOpen}
      onClose={setIsModalOpen}
      closeOnOutsideClick={true}
      width={550}
      modalStyle={{ top: -130 }}
      centered={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleAddSupllier(values)}
      >
        <Row gutter={16}>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>
                  Nom du fournisseur
                </span>
              }
              name="supplierName"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le nom",
                },
              ]}
            >
              <Input placeholder="Nom du fournisseur" />
            </Form.Item>
          </Col>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>
                  Num de Téléphone
                </span>
              }
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le num de téléphone",
                },
              ]}
            >
              <Input placeholder="Num de Téléphone" />
            </Form.Item>
          </Col>

          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>
                  Adresse email
                </span>
              }
              name="email"
            >
              <Input placeholder="Adresse email" />
            </Form.Item>
          </Col>

          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>Adresse</span>
              }
              name="address"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir l'adresse du client",
                },
              ]}
            >
              <Input placeholder="Adresse" />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16} justify="end">
          <Col xxl={10} xl={10} lg={10} md={12} sm={24} xs={24}>
            <Button
              icon={<RiSave2Fill />}
              className={styles["ms--client-btn"]}
              type="submit"
              loading={loading}
            >
              Ajouter le fournisseur
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddSupllier;
