import React, { useState, useMemo } from "react";
import Modal from "../../components/Modal";
import styles from "../../styles/clients.module.scss";
import style from "../../styles/invoice.module.scss";
import { Col, Divider, Form, Row } from "antd";
import Button from "../../components/Button";
import { RiSave2Fill } from "react-icons/ri";
import { FiTrash2, FiPlusCircle } from "react-icons/fi";
import Select from "../../components/Select";
import DatePicker from "../../components/DatePicker";
import Input from "../../components/Input";
import dayjs from "dayjs";

interface AddInvoiceProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  handleAddInvoice: (values: any) => void;
  form: any;
  loading?: boolean;
  clients?: any;
  products?: any;
}

type InvoiceItem = {
  productId: string | null;
  qty: number;
  price: number;
  taxRate: number;
};

const AddInvoice: React.FC<AddInvoiceProps> = ({
  isModalOpen,
  setIsModalOpen,
  form,
  handleAddInvoice,
  loading,
  clients,
  products,
}) => {
  const [items, setItems] = useState<InvoiceItem[]>([
    { productId: null, qty: 1, price: 0, taxRate: 0 },
  ]);
  const [discount, setDiscount] = useState(0);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.qty * item.price, 0),
    [items]
  );
  const tax = subtotal * 0.19;
  const totalBeforeDiscount = subtotal + tax;
  const discountAmount = (totalBeforeDiscount * discount) / 100;
  const total = totalBeforeDiscount - discountAmount;

  const addItem = () =>
    setItems([...items, { productId: null, qty: 1, price: 0, taxRate: 0 }]);
  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = <K extends keyof InvoiceItem>(
    index: number,
    field: K,
    value: InvoiceItem[K]
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  return (
    <Modal
      title={
        <div className={styles["ms--modal-title-icon"]}>
          <span>Créer une facture</span>
        </div>
      }
      open={isModalOpen}
      onClose={setIsModalOpen}
      width={950}
      modalStyle={{ top: -250 }}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          handleAddInvoice(values);
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Nom du client" name="clientId">
              <Select
                placeholder="Sélectionner un client"
                options={clients?.map((c: any) => ({
                  label: `${c.firstName} ${c.lastName}`,
                  value: c.id,
                }))}
                classname={styles["ms--select-add-product"]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Date de facture"
              name="paymentDate"
              getValueProps={(value) => ({
                value: value ? dayjs(value) : undefined,
              })}
              normalize={(value) => value?.format("YYYY-MM-DD")}
            >
              <DatePicker placeholder="AAAA-MM-JJ" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Échéance"
              name="dueDate"
              getValueProps={(value) => ({
                value: value ? dayjs(value) : undefined,
              })}
              normalize={(value) => value?.format("YYYY-MM-DD")}
            >
              <DatePicker placeholder="AAAA-MM-JJ" />
            </Form.Item>
          </Col>
        </Row>

        <div>
          <Row gutter={16}>
            <Col span={10} className={style["ms--invoice-content"]}>
              Produit
            </Col>
            <Col span={4} className={style["ms--invoice-content"]}>
              Quantité
            </Col>
            <Col span={4} className={style["ms--invoice-content"]}>
              Taux de taxe
            </Col>
            <Col span={3} className={style["ms--invoice-content"]}>
              Prix
            </Col>
            <Col span={3} className={style["ms--invoice-content"]}>
              Total
            </Col>
          </Row>

          {items.map((item, i) => (
            <Row key={i} gutter={16} align={"middle"} style={{ marginTop: 12 }}>
              <Col span={10}>
                <Form.Item name={["items", i, "productId"]}>
                  <Select
                    placeholder="Nom du produit"
                    options={products?.map((p: any) => ({
                      label: p.productName,
                      value: p.id,
                    }))}
                    value={item.productId}
                    onChange={(selectedId) => {
                      if (selectedId === null) {
                        updateItem(i, "productId", null);
                        updateItem(i, "price", 0);
                        updateItem(i, "taxRate", 0);
                        return;
                      }

                      const selectedProduct =
                        products &&
                        products.find((p: any) => p.id === selectedId);
                      if (selectedProduct) {
                        updateItem(i, "productId", selectedProduct.id);
                        updateItem(i, "price", Number(selectedProduct.price));
                        updateItem(
                          i,
                          "taxRate",
                          Number(selectedProduct.taxRate) || 0
                        );
                      }
                    }}
                    classname={styles["ms--select-add-product"]}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name={["items", i, "qty"]}
                  normalize={(value) => {
                    const numValue = Number(value);
                    return isNaN(numValue) ? 1 : Math.max(1, numValue);
                  }}
                >
                  <Input
                    type="number"
                    min={1}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      updateItem(
                        i,
                        "qty",
                        isNaN(value) ? 1 : Math.max(1, value)
                      );
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item
                  name={["items", i, "taxRate"]}
                  normalize={(value) => {
                    const numValue = Number(value);
                    return isNaN(numValue) ? 1 : Math.max(1, numValue);
                  }}
                >
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={item.taxRate}
                    onChange={(e) =>
                      updateItem(i, "taxRate", Number(e.target.value))
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={item.price}
                    onChange={(e) =>
                      updateItem(i, "price", Number(e.target.value))
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item>
                  <span className={styles.item_total}>
                    {(item.qty * item.price).toFixed(2)} DT
                  </span>
                </Form.Item>
              </Col>

              {items.length > 1 && (
                <Form.Item>
                  <FiTrash2
                    color="#f05858"
                    onClick={() => removeItem(i)}
                    size={16}
                    className={style["ms--remove-product-icon"]}
                  />
                </Form.Item>
              )}
            </Row>
          ))}

          <button
            onClick={addItem}
            className={styles["ms--add-product-item-btn"]}
          >
            <FiPlusCircle /> Ajouter un produit
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 20,
          }}
        >
          <Row justify="end">
            <Col span={6} className={style["ms--invoice-titles"]}>
              Total HT
            </Col>
            <Col span={4} className={style["ms--invoice-content"]}>
              {subtotal.toFixed(2)} DT
            </Col>
          </Row>
          <Row justify="end">
            <Col span={6} className={style["ms--invoice-titles"]}>
              Tax (19%)
            </Col>
            <Col span={4} className={style["ms--invoice-content"]}>
              {tax.toFixed(2)} DT
            </Col>
          </Row>
          <Row justify="end">
            <Col span={6} className={style["ms--invoice-content"]}>
              Total TTC
            </Col>
            <Col span={4} className={style["ms--invoice-content"]}>
              {total.toFixed(2)} DT
            </Col>
          </Row>
        </div>
        <Divider />

        <Row justify="end">
          <Col span={5}>
            <Button icon={<RiSave2Fill />} type="submit" loading={loading}>
              Enregistrer la facture
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddInvoice;
