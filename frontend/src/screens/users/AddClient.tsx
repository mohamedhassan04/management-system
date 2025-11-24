import React from "react";
import { Col, Divider, Form, Row } from "antd";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import styles from "../../styles/clients.module.scss";
import { RiSave2Fill } from "react-icons/ri";

interface AddClientProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  handleAddUser: (values: any) => void;
  form: any;
}

const AddClient: React.FC<AddClientProps> = ({
  isModalOpen,
  setIsModalOpen,
  form,
  handleAddUser,
}) => {
  return (
    <Modal
      title={
        <div className={styles["ms--modal-title-icon"]}>
          <div></div>
          <span>Ajouter un client</span>
        </div>
      }
      open={isModalOpen}
      onClose={setIsModalOpen}
      closeOnOutsideClick={true}
      width={550}
      modalStyle={{ top: -200 }}
      centered={true}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={<span className={styles["ms--client-label"]}>Nom</span>}
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le nom",
                },
              ]}
            >
              <Input placeholder="Nom" />
            </Form.Item>
          </Col>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={<span className={styles["ms--client-label"]}>Prénom</span>}
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le prrénom",
                },
              ]}
            >
              <Input placeholder="Prénom" />
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
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir l'adresse email",
                },
              ]}
            >
              <Input placeholder="Adresse email" />
            </Form.Item>
          </Col>

          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>
                  Num de téléphone
                </span>
              }
              name="phone"
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

          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
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

          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            <Form.Item
              label={<span className={styles["ms--client-label"]}>Notes</span>}
              name="notes"
            >
              <Input placeholder="Notes" />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16} justify="end">
          <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
            <Button
              icon={<RiSave2Fill />}
              className={styles["ms--client-btn"]}
              type="submit"
              onClick={() => handleAddUser}
            >
              Ajouter le client
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddClient;
