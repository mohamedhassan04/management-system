import React, { useState } from "react";
import Modal from "../../components/Modal";
import styles from "../../styles/clients.module.scss";
import { Col, Divider, Form, Row, Tooltip } from "antd";
import Button from "../../components/Button";
import { RiSave2Fill } from "react-icons/ri";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { PiPlusCircleBold } from "react-icons/pi";
import AddCategory from "./AddCategory";
import { useNavigate } from "react-router-dom";

interface AddProductProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  handleAddProduct: (values: any) => void;
  form: any;
  loading?: boolean;
  categories?: any;
  suppliers?: any;
}

const AddProduct: React.FC<AddProductProps> = ({
  isModalOpen,
  setIsModalOpen,
  form,
  handleAddProduct,
  loading,
  categories,
  suppliers,
}) => {
  const navigate = useNavigate();
  const [openModalCategory, setOpenModalCategory] = useState<boolean>(false);

  return (
    <>
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
                  <span className={styles["ms--client-label"]}>
                    Description
                  </span>
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
                <Row gutter={8} align="middle">
                  <Col flex="auto">
                    <Select
                      options={categories?.map((item: any) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      placeholder="Categorie"
                      classname={styles["ms--select-add-product"]}
                      value={form.getFieldValue("category")}
                      onChange={(value) => {
                        form.setFieldsValue({ category: value });
                      }}
                    />
                  </Col>
                  <Col>
                    <Tooltip title="Ajouter une catégorie">
                      <PiPlusCircleBold
                        size={18}
                        color="#4e46e5dc"
                        className={styles["ms--add-icon"]}
                        onClick={() => setOpenModalCategory(true)}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </Form.Item>
            </Col>

            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label={
                  <span className={styles["ms--client-label"]}>Référence</span>
                }
                name="sku"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le référence",
                  },
                ]}
              >
                <Input placeholder="Référence" />
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
                <Input type="number" min={0} placeholder="Quantité" />
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
                <Input type="number" min={0} placeholder="Prix" />
              </Form.Item>
            </Col>

            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item
                label={
                  <span className={styles["ms--client-label"]}>
                    Fournisseur
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le fournisseur",
                  },
                ]}
                name="supllier"
              >
                <Row gutter={8} align="middle">
                  <Col flex="auto">
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
                      value={form.getFieldValue("supllier")}
                      onChange={(value) => {
                        form.setFieldsValue({ supllier: value });
                      }}
                    />
                  </Col>
                  <Col>
                    <Tooltip title="Ajouter un fournisseur">
                      <PiPlusCircleBold
                        size={18}
                        color="#4e46e5dc"
                        className={styles["ms--add-icon"]}
                        onClick={() => navigate("/suplliers")}
                      />
                    </Tooltip>
                  </Col>
                </Row>
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

      <AddCategory
        isModalOpen={openModalCategory}
        setIsModalOpen={() => setOpenModalCategory(!openModalCategory)}
      />
    </>
  );
};

export default AddProduct;
