import React from "react";
import Modal from "../../components/Modal";
import styles from "../../styles/clients.module.scss";
import { Col, Divider, Form, Row } from "antd";
import Button from "../../components/Button";
import { RiSave2Fill } from "react-icons/ri";
import Input from "../../components/Input";
import { useCreateCategorieMutation } from "../../apis/actions/productApi";

interface AddCategoryProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const [form] = Form.useForm();
  const [createCategorie, { isLoading }] = useCreateCategorieMutation();

  const handleAddCategory = async (values: any) => {
    try {
      await createCategorie(values).unwrap();
      form.resetFields();
      setIsModalOpen();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

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
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleAddCategory(values)}
      >
        <Row gutter={16}>
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            <Form.Item
              label={
                <span className={styles["ms--client-label"]}>
                  Nom du catégorie
                </span>
              }
              name="name"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le nom de la catégorie",
                },
              ]}
            >
              <Input placeholder="Nom du catégorie" />
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
              loading={isLoading}
            >
              Ajouter la catégorie
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddCategory;
