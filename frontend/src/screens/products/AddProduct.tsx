import React from "react";
import Modal from "../../components/Modal";
import styles from "../../styles/clients.module.scss";
import { Col, Divider, Form, Row } from "antd";
import Button from "../../components/Button";
import { RiSave2Fill } from "react-icons/ri";
import Input from "../../components/Input";

interface AddProductProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  handleAddProduct: (values: any) => void;
  form: any;
  loading?: boolean;
}

const AddProduct: React.FC<AddProductProps> = ({
  isModalOpen,
  setIsModalOpen,
  form,
  handleAddProduct,
  loading,
}) => {
  return (
    <Modal
      title={
        <div className={styles["ms--modal-title-icon"]}>
          <div></div>
          <span>Ajouter un produit</span>
        </div>
      }
      open={isModalOpen}
      onClose={setIsModalOpen}
      closeOnOutsideClick={true}
      width={550}
      modalStyle={{ top: -230 }}
      centered={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleAddProduct(values)}
      >
        <Row gutter={16}>
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>
                  Nom du produit
                </span>
              }
              name="productName"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le nom du produit",
                },
              ]}
            >
              <Input placeholder="Nom du produit" />
            </Form.Item>
          </Col>
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>Description</span>
              }
              name="description"
            >
              <Input placeholder="Description" />
            </Form.Item>
          </Col>

          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>Catégorie</span>
              }
              name="category"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir la categorie",
                },
              ]}
            >
              <Input placeholder="Categorie" />
            </Form.Item>
          </Col>

          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={<span className={styles["ms--client-label"]}>SKU</span>}
              name="sku"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le sku",
                },
              ]}
            >
              <Input placeholder="Sku" />
            </Form.Item>
          </Col>

          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>Quantité</span>
              }
              name="quantity"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir la quantité",
                },
              ]}
            >
              <Input min={0} placeholder="Quantité" />
            </Form.Item>
          </Col>

          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>
                  Prix unitaire
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le prix unitaire",
                },
              ]}
              name="price"
            >
              <Input min={0} placeholder="Prix" />
            </Form.Item>
          </Col>

          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>Fournisseur</span>
              }
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le fournisseur",
                },
              ]}
              name="supllier"
            >
              <Input placeholder="Fournisseur" />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16} justify="end">
          <Col xxl={9} xl={9} lg={9} md={12} sm={24} xs={24}>
            <Button
              icon={<RiSave2Fill />}
              className={styles["ms--client-btn"]}
              type="submit"
              loading={loading}
            >
              Ajouter le produit
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddProduct;
