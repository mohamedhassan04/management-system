import { Col, Form, Pagination, Popconfirm, Row, Space } from "antd";
import React, { useState } from "react";
import styles from "../../styles/clients.module.scss";
import {
  useCreateProductMutation,
  useFindAllProductsQuery,
  useRemoveProductMutation,
  useUpdateProductMutation,
} from "../../apis/actions/productApi";
import { RiDeleteBin6Fill, RiEditFill } from "react-icons/ri";
import { FcFullTrash } from "react-icons/fc";
import StatusTag from "../../components/StatusTag";
import Button from "../../components/Button";
import { HiUserAdd } from "react-icons/hi";
import Input from "../../components/Input";
import { IoMdSearch } from "react-icons/io";
import Select from "../../components/Select";
import Table from "../../components/Table";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";

const Products: React.FC = () => {
  const [form] = Form.useForm();

  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<null | any>(null);
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [searchStockLevel, setSearchStockLevel] = useState<string>("");

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [removeClient] = useRemoveProductMutation();

  const { data, isLoading } = useFindAllProductsQuery({
    page: page,
    limit: 5,
    category: searchCategory,
    status: searchStockLevel,
  });

  // Function to update product data
  const handleUpdateProduct = async (id: string, product: any) => {
    try {
      const values = {
        ...product,
        price: Number(product.price),
      };
      await updateProduct({ id, data: values }).unwrap();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to add a new product
  const handleAddProduct = async () => {
    try {
      const values = form.getFieldsValue();
      const product = {
        ...values,
        description: values.description ?? null,
        price: Number(values.price),
        quantity: Number(values.quantity),
      };
      await createProduct(product).unwrap();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  // Function to delete a product
  const handleDeleteProduct = async (id: string) => {
    try {
      await removeClient({ id }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  // Function to cancel the edit modal
  const handleCancelEditModal = () => {
    setSelectedProduct(null);
    form.resetFields();
    setIsEditModalOpen(false);
  };

  // Function to show the edit modal
  const handleShowEditModal = (product: any) => {
    setSelectedProduct(product);
    form.setFieldsValue(product);
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      title: "Nom de produit",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Categorie",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Stock disponible",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Prix unitaire",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Dernier restock",
      dataIndex: "lastRestock",
      key: "lastRestock",
    },
    {
      title: "Fournisseur",
      dataIndex: "supllier",
      key: "supllier",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) => <StatusTag status={status} />,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="small">
          <button
            className={styles["ms--client-actions"]}
            onClick={() => handleShowEditModal(record)}
          >
            <RiEditFill size={18} color="#656c8c" />
          </button>
          <Popconfirm
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Oui"
            cancelText="Non"
            okButtonProps={{
              style: {
                backgroundColor: "#3b3391",
                borderColor: "#3b3391",
                color: "#fff",
              },
            }}
            cancelButtonProps={{
              style: {
                backgroundColor: "#f0f0f0",
                borderColor: "#d9d9d9",
                color: "#000",
              },
            }}
            title={
              <span className={styles["ms--popconfirm-title"]}>
                Supprimer ce produit
              </span>
            }
            description={
              <span className={styles["ms--popconfirm-description"]}>
                Voulez-vous vraiment supprimer ce produit ?
              </span>
            }
            icon={<FcFullTrash size={20} />}
            showArrow
            placement="top"
          >
            <button className={styles["ms--client-actions"]}>
              <RiDeleteBin6Fill size={18} color="#f05858" />
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col span={20}>
          <h1 className={styles["ms--client-title"]}>Mes produits</h1>
        </Col>
        <Col span={4}>
          <Button
            icon={<HiUserAdd />}
            className={styles["ms--client-btn"]}
            onClick={() => setIsModalOpen(true)}
          >
            Ajouter un produit
          </Button>
        </Col>
      </Row>
      <div className={styles["ms--client-table-container"]}>
        <Row style={{ marginBottom: "1.5rem" }} align="middle" gutter={16}>
          <Col span={16}>
            <Input
              placeholder="Rechercher un produit par son nom ou son SKU ..."
              className={styles["ms--client-input"]}
              suffix={<IoMdSearch size={20} />}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Stock"
              options={[
                { value: "en_stock", label: "En stock" },
                { value: "stock_faible", label: "Stock faible" },
                { value: "rupture_de_stock", label: "Rupture de stock" },
              ]}
              onChange={(e) => {
                setSearchStockLevel(e);
              }}
              classname={styles["ms--client-select"]}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Catégories"
              options={[
                { value: "Eléctronique", label: "Eléctronique" },
                { value: "Alimentaire", label: "Alimentaire" },
                { value: "Tabac", label: "Tabac" },
                { value: "Electromenager", label: "Electromenager" },
                { value: "Autre", label: "Autre" },
              ]}
              onChange={(e) => {
                setSearchCategory(e);
              }}
              classname={styles["ms--client-select"]}
            />
          </Col>
        </Row>

        <Table
          data={data && data.items}
          columns={columns}
          rowKey="id"
          loading={isLoading}
        />
        <Pagination
          align="center"
          current={data?.page}
          total={data?.total}
          pageSize={data?.limit}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
          className={styles["ms--client-pagination"]}
          responsive
        />
      </div>

      <AddProduct
        isModalOpen={isModalOpen}
        setIsModalOpen={() => setIsModalOpen(false)}
        form={form}
        handleAddProduct={handleAddProduct}
        loading={isCreating}
      />

      <EditProduct
        selectedProduct={selectedProduct}
        form={form}
        handleUpdateProduct={handleUpdateProduct}
        isModalEditOpen={isEditModalOpen}
        setIsModalEditOpen={handleCancelEditModal}
        loading={isUpdating}
      />
    </>
  );
};

export default Products;
