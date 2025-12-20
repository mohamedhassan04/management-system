import {
  Col,
  Form,
  notification,
  Pagination,
  Popconfirm,
  Row,
  Space,
  type TableColumnsType,
} from "antd";
import React, { useState } from "react";
import styles from "../../styles/clients.module.scss";
import {
  useAddStockProductMutation,
  useCreateProductMutation,
  useFindAllCategoriesQuery,
  useFindAllProductsQuery,
  useFindAllSuplliersQuery,
  useRemoveProductMutation,
  useUpdateProductMutation,
} from "../../apis/actions/productApi";
import { RiDeleteBin6Fill, RiEditFill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
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
import ProductDetails from "./ProductDetails";
import Popover from "../../components/Popover";
import AddStock from "./AddStock";
import { BiPlusMedical } from "react-icons/bi";

interface ProductsProps {
  api: ReturnType<typeof notification.useNotification>[0];
}

const Products: React.FC<ProductsProps> = ({ api }) => {
  const [form] = Form.useForm();

  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isProductDetails, setIsProductDetails] = useState<boolean>(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<null | any>(null);
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [searchStockLevel, setSearchStockLevel] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [addStockProduct, { isLoading: isAddingStock }] =
    useAddStockProductMutation();
  const [removeProduct] = useRemoveProductMutation();

  const { data, isLoading } = useFindAllProductsQuery({
    page: page,
    limit: 5,
    category: searchCategory,
    status: searchStockLevel,
    search: searchTerm,
  });
  const { data: categories } = useFindAllCategoriesQuery();
  const { data: suppliers } = useFindAllSuplliersQuery();

  // Function to update product data
  const handleUpdateProduct = async (id: string, product: any) => {
    try {
      const values = {
        ...product,
        price: Number(product.price),
      };
      await updateProduct({ id, data: values }).unwrap();
      api.success({
        message: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès.",
        placement: "bottomRight",
      });
      setSelectedProduct(null);
      setIsEditModalOpen(false);
      form.resetFields();
    } catch (error) {
      api.error({
        message: "Erreur de mise à jour",
        description:
          (error as any)?.data?.message[0] || "Une erreur est survenue",
        placement: "bottomRight",
      });
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
      api.success({
        message: "Nouveau produit ajouté",
        description: "Le produit a été ajouté avec succès.",
        placement: "bottomRight",
      });
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      api.error({
        message: "Erreur d'ajout",
        description:
          (error as any)?.data?.message[0] || "Une erreur est survenue",
        placement: "bottomRight",
      });
    }
  };

  const handleAddStock = async (id: string, product: any) => {
    try {
      const values = {
        quantity: Number(product.quantity),
      };
      await addStockProduct({ id, product: values }).unwrap();
      api.success({
        message: "Stock mis à jour",
        description: "Le stock a été mis à jour avec succès.",
        placement: "bottomRight",
      });
      setSelectedProduct(null);
      setIsAddStockOpen(false);
    } catch (error) {
      api.error({
        message: "Erreur de mise à jour",
        description:
          (error as any)?.data?.message[0] || "Une erreur est survenue",
        placement: "bottomRight",
      });
    }
  };

  // Function to delete a product
  const handleDeleteProduct = async (id: string) => {
    try {
      await removeProduct({ id }).unwrap();
      api.success({
        message: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
        placement: "bottomRight",
      });
    } catch (error) {
      api.error({
        message: "Erreur de suppression",
        description:
          (error as any)?.data?.message[0] || "Une erreur est survenue",
        placement: "bottomRight",
      });
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
    form.setFieldsValue({
      ...product,
      category: product?.category?.id,
      supllier: product?.supllier?.id,
    });
    setIsEditModalOpen(true);
  };

  // Function to show the details modal
  const handleShowProductDetails = (product: any) => {
    setSelectedProduct(product);
    setIsProductDetails(true);
  };

  // Function to cancel the details modal
  const handleCancelProductDetails = () => {
    setSelectedProduct(null);
    setIsProductDetails(false);
  };

  const handleShowAddStockModal = (product: any) => {
    setSelectedProduct(product);
    setIsAddStockOpen(true);
  };

  const handleCancelAddStockModal = () => {
    setSelectedProduct(null);
    setIsAddStockOpen(false);
  };

  const columns: TableColumnsType = [
    {
      title: "Référence",
      dataIndex: "sku",
      key: "sku",
      width: 200,
    },
    {
      title: "Nom de produit",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Categorie",
      dataIndex: "category",
      key: "category",
      render: (_: any, record: any) => record?.category?.name,
    },
    {
      title: "Stock disponible",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Prix unitaire",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      render: (status: any) => <StatusTag status={status} />,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      fixed: "right",
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
          <Popover
            content={
              <>
                <div
                  className={styles["ms--popover-item"]}
                  onClick={() => handleShowProductDetails(record)}
                >
                  <button className={styles["ms--client-actions"]}>
                    <FaCircleInfo size={18} color="#14ba83" />
                  </button>
                  <span>Détail du produit</span>
                </div>
                <div
                  className={styles["ms--popover-item"]}
                  onClick={() => handleShowAddStockModal(record)}
                >
                  <button className={styles["ms--client-actions"]}>
                    <BiPlusMedical size={18} color="#0077ff" />
                  </button>
                  <span>Ajouter stock</span>
                </div>
              </>
            }
          >
            <button className={styles["ms--client-actions"]}>
              <BsThreeDotsVertical size={18} color="#656c8c" />
            </button>
          </Popover>
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
              options={
                categories &&
                categories?.map((item: any) => ({
                  value: item.name,
                  label: item.name,
                }))
              }
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
          scroll={{ x: 1000 }}
        />
        {data && (
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
        )}
      </div>

      <AddProduct
        isModalOpen={isModalOpen}
        setIsModalOpen={() => setIsModalOpen(false)}
        form={form}
        handleAddProduct={handleAddProduct}
        loading={isCreating}
        categories={categories}
        suppliers={suppliers}
      />

      <EditProduct
        selectedProduct={selectedProduct}
        form={form}
        handleUpdateProduct={handleUpdateProduct}
        isModalEditOpen={isEditModalOpen}
        setIsModalEditOpen={handleCancelEditModal}
        loading={isUpdating}
        categories={categories}
        suppliers={suppliers}
      />

      <AddStock
        isModalOpen={isAddStockOpen}
        setIsModalOpen={handleCancelAddStockModal}
        form={form}
        handleAddStock={handleAddStock}
        selectedProduct={selectedProduct}
        loading={isAddingStock}
      />

      <ProductDetails
        selectedProduct={selectedProduct}
        isModalProductDetailsOpen={isProductDetails}
        setIsModalProductDetailsOpen={handleCancelProductDetails}
      />
    </>
  );
};

export default Products;
