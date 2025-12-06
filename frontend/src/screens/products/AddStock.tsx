import React from "react";
import Modal from "../../components/Modal";
import styles from "../../styles/clients.module.scss";
import { Col, Divider, Form, Row } from "antd";
import Button from "../../components/Button";
import { RiSave2Fill } from "react-icons/ri";
import Input from "../../components/Input";

interface AddStockProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  handleAddStock: (id: string, product: any) => void;
  form: any;
  loading?: boolean;
  selectedProduct: any;
}

const AddStock: React.FC<AddStockProps> = ({
  isModalOpen,
  setIsModalOpen,
  form,
  handleAddStock,
  loading,
  selectedProduct,
}) => {
  return (
    <>
      <Modal
        title={
          <div className={styles["ms--modal-title-icon"]}>
            <div></div>
            <span>Ajouter stock de produit</span>
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
          onFinish={(values) => handleAddStock(selectedProduct.id, values)}
        >
          <Row gutter={16}>
            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item
                label={
                  <span className={styles["ms--client-label"]}>Quantité</span>
                }
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir la quantité du produit",
                  },
                ]}
              >
                <Input type="number" min={1} placeholder="Quantité" />
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
                Ajouter stock
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AddStock;
