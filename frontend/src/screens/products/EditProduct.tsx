import { Col, Divider, Form, Row } from "antd";
import React from "react";
import styles from "../../styles/clients.module.scss";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { RiSave2Fill } from "react-icons/ri";
import Modal from "../../components/Modal";
import Select from "../../components/Select";

interface EditProductProps {
  isModalEditOpen: boolean;
  setIsModalEditOpen: () => void;
  handleUpdateProduct: (id: string, product: any) => void;
  form: any;
  selectedProduct: any;
  loading?: boolean;
  categories?: any;
  suppliers?: any;
}

const EditProduct: React.FC<EditProductProps> = ({
  isModalEditOpen,
  setIsModalEditOpen,
  form,
  handleUpdateProduct,
  selectedProduct,
  loading,
  categories,
  suppliers,
}) => {
  return (
    <Modal
      title={
        <div className={styles["ms--modal-title-icon"]}>
          <div></div>
          <span>Modifier un produit</span>
        </div>
      }
      open={isModalEditOpen}
      onClose={setIsModalEditOpen}
      closeOnOutsideClick={true}
      showCloseIcon={true}
      width={550}
      modalStyle={{ top: -230 }}
      centered={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleUpdateProduct(selectedProduct.id, values)}
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
            >
              <Select
                options={
                  categories &&
                  categories?.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  }))
                }
                placeholder="Categorie"
                classname={styles["ms--select-add-product"]}
              />
            </Form.Item>
          </Col>

          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>Référence</span>
              }
              name="sku"
            >
              <Input placeholder="Référence" />
            </Form.Item>
          </Col>

          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>
                  Prix unitaire
                </span>
              }
              name="price"
            >
              <Input min={0} type="number" placeholder="Prix" />
            </Form.Item>
          </Col>

          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>Fournisseur</span>
              }
              name="supllier"
            >
              <Select
                options={
                  suppliers &&
                  suppliers.map((item: any) => ({
                    value: item.id,
                    label: item.supplierName,
                  }))
                }
                placeholder="Fournisseur"
                classname={styles["ms--select-add-product"]}
              />
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
              Modifier le produit
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditProduct;
