import React from "react";
import styles from "../../styles/clients.module.scss";
import style from "../../styles/product.module.scss";
import Modal from "../../components/Modal";
import { Col, Divider, Row } from "antd";
import StatusTag from "../../components/StatusTag";
import Button from "../../components/Button";
import { TbMessage2Cancel } from "react-icons/tb";
import Input from "../../components/Input";

interface ProductDetailsProps {
  selectedProduct: any;
  isModalProductDetailsOpen: boolean;
  setIsModalProductDetailsOpen: (value: boolean) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  selectedProduct,
  isModalProductDetailsOpen,
  setIsModalProductDetailsOpen,
}) => {
  return (
    <Modal
      title={
        <div className={styles["ms--modal-title-icon"]}>
          <div></div>
          <span>Détails du produit</span>
        </div>
      }
      open={isModalProductDetailsOpen}
      onClose={() => setIsModalProductDetailsOpen(false)}
      closeOnOutsideClick={true}
      width={600}
      modalStyle={{ top: -200 }}
      centered={true}
    >
      <Row gutter={[16, 16]} align={"middle"}>
        {selectedProduct?.description && (
          <Col span={24}>
            <span className={style["ms--product-titles"]}>Description</span>
            <p className={style["ms--product-content"]}>
              {selectedProduct?.description}
            </p>
          </Col>
        )}

        <Col span={12}>
          <span className={style["ms--product-titles"]}>SKU</span>
          <p className={style["ms--product-content"]}>{selectedProduct?.sku}</p>
        </Col>
        <Col span={12}>
          <span className={style["ms--product-titles"]}>Catégorie</span>
          <p className={style["ms--product-content"]}>
            {selectedProduct?.category?.name}
          </p>
        </Col>

        <Col span={12}>
          <span className={style["ms--product-titles"]}>Prix unitaire</span>
          <p className={style["ms--product-content"]}>
            {selectedProduct?.price} DT
          </p>
        </Col>
        <Col span={12}>
          <span className={style["ms--product-titles"]}>Niveau de stock</span>
          <div className={style["ms--product-stock-status"]}>
            <p className={style["ms--product-content"]}>
              {selectedProduct?.quantity} unité(s)
            </p>{" "}
            <StatusTag status={selectedProduct?.status} />
          </div>
        </Col>

        <Col span={12}>
          <span className={style["ms--product-titles"]}>Fournisseur</span>
          <p className={style["ms--product-content"]}>
            {selectedProduct?.supllier?.supplierName}
          </p>
        </Col>
        <Col span={12}>
          <span className={style["ms--product-titles"]}>
            Dernier Restockage
          </span>
          <p className={style["ms--product-content"]}>
            {selectedProduct?.lastRestock}
          </p>
        </Col>
      </Row>

      <Divider />
      <Row gutter={16} justify="end">
        <Col xxl={5} xl={5} lg={5} md={12} sm={24} xs={24}>
          <Button
            icon={<TbMessage2Cancel />}
            className={styles["ms--client-btn"]}
            onClick={() => setIsModalProductDetailsOpen(false)}
          >
            Fermer
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default ProductDetails;
