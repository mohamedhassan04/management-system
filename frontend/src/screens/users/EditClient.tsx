import React from "react";
import Modal from "../../components/Modal";
import styles from "../../styles/clients.module.scss";
import { Col, Divider, Form, Row } from "antd";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { RiSave2Fill } from "react-icons/ri";

interface EditClientProps {
  isModalEditOpen: boolean;
  setIsModalEditOpen: () => void;
  handleUpdateClient: (id: string, client: any) => void;
  form: any;
  selectedClient: any;
}

const EditClient: React.FC<EditClientProps> = ({
  isModalEditOpen,
  setIsModalEditOpen,
  form,
  handleUpdateClient,
  selectedClient,
}) => {
  return (
    <Modal
      title={
        <div className={styles["ms--modal-title-icon"]}>
          <div></div>
          <span>Modifier un client</span>
        </div>
      }
      open={isModalEditOpen}
      onClose={setIsModalEditOpen}
      closeOnOutsideClick={true}
      showCloseIcon={true}
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
            >
              <Input placeholder="Nom" />
            </Form.Item>
          </Col>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={<span className={styles["ms--client-label"]}>Prénom</span>}
              name="firstName"
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
          <Col xxl={9} xl={9} lg={8} md={12} sm={24} xs={24}>
            <Button
              icon={<RiSave2Fill />}
              className={styles["ms--client-btn"]}
              type="submit"
              onClick={() =>
                handleUpdateClient(selectedClient.id, form.getFieldsValue())
              }
            >
              Modifier le client
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditClient;
