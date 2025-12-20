import React, { useState } from "react";
import styles from "../../styles/clients.module.scss";
import {
  Col,
  Form,
  notification,
  Pagination,
  Popconfirm,
  Row,
  Space,
} from "antd";
import { RiDeleteBin6Fill, RiEditFill } from "react-icons/ri";
import { FcFullTrash } from "react-icons/fc";
import Button from "../../components/Button";
import { HiUserAdd } from "react-icons/hi";
import Input from "../../components/Input";
import { IoMdSearch } from "react-icons/io";
import Table from "../../components/Table";
import {
  useCreateSupllierMutation,
  useFindAllSuplliersSearchQuery,
  useRemoveSupllierMutation,
  useUpdateSupllierMutation,
} from "../../apis/actions/suplliersApi";
import AddSupllier from "./AddSupllier";
import { BiMailSend } from "react-icons/bi";
import EditSupllier from "./EditSupllier";

interface SupllierProps {
  api: ReturnType<typeof notification.useNotification>[0];
}

const Suplliers: React.FC<SupllierProps> = ({ api }) => {
  const [form] = Form.useForm();

  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedSupllier, setSelectedSupllier] = useState<null | any>(null);
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const [createSupllier, { isLoading: isCreating }] =
    useCreateSupllierMutation();
  const [updateSupllier, { isLoading: isUpdating }] =
    useUpdateSupllierMutation();
  const [removeSupllier] = useRemoveSupllierMutation();
  const { data, isLoading } = useFindAllSuplliersSearchQuery({
    page: page,
    limit: 5,
    status: searchStatus,
    search: searchTerm,
  });

  // Function to update supllier data
  const handleUpdateSupllier = async (id: string, supllier: any) => {
    try {
      await updateSupllier({ id, data: supllier }).unwrap();
      api.success({
        message: "Fournisseur mis à jour",
        description: "Les informations du fournisseur ont été mises à jour.",
        placement: "bottomRight",
      });
      setSelectedSupllier(null);
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

  // Function to add a new supllier
  const handleAddSupllier = async () => {
    try {
      const values = form.getFieldsValue();
      await createSupllier(values).unwrap();
      api.success({
        message: "Nouveau fournisseur ajouté",
        description: "Le fournisseur a été ajouté avec succès.",
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

  // Function to delete a supllier
  const handleDeleteSupllier = async (id: string) => {
    try {
      await removeSupllier({ id }).unwrap();
      api.success({
        message: "Fournisseur supprimé",
        description: "Le fournisseur a été supprimé avec succès.",
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
    setSelectedSupllier(null);
    form.resetFields();
    setIsEditModalOpen(false);
  };

  // Function to show the edit modal
  const handleShowEditModal = (client: any) => {
    setSelectedSupllier(client);
    form.setFieldsValue(client);
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      title: "Nom du fournisseur",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "Téléphone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: any) =>
        email ? (
          email
        ) : (
          <span className={styles["ms--no-email"]}>
            <BiMailSend size={18} /> Aucune adresse email fournie
          </span>
        ),
    },
    {
      title: "Adresse",
      dataIndex: "address",
      key: "address",
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
            onConfirm={() => handleDeleteSupllier(record.id)}
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
                Supprimer ce client
              </span>
            }
            description={
              <span className={styles["ms--popconfirm-description"]}>
                Voulez-vous vraiment supprimer ce client ?
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
        <Col span={19}>
          <h1 className={styles["ms--client-title"]}>Mes fournisseurs</h1>
        </Col>
        <Col span={5}>
          <Button
            icon={<HiUserAdd />}
            className={styles["ms--client-btn"]}
            onClick={() => setIsModalOpen(true)}
          >
            Ajouter un fournisseur
          </Button>
        </Col>
      </Row>
      <div className={styles["ms--client-table-container"]}>
        <Row style={{ marginBottom: "1.5rem" }} align="middle" gutter={16}>
          <Col span={20}>
            <Input
              placeholder="Rechercher un fournisseur par son nom ou son email ou son phone ..."
              className={styles["ms--client-input"]}
              suffix={<IoMdSearch size={20} />}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
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

        <AddSupllier
          isModalOpen={isModalOpen}
          setIsModalOpen={() => setIsModalOpen(false)}
          form={form}
          handleAddSupllier={handleAddSupllier}
          loading={isCreating}
        />

        <EditSupllier
          isModalEditOpen={isEditModalOpen}
          setIsModalEditOpen={handleCancelEditModal}
          form={form}
          selectedSupllier={selectedSupllier}
          handleUpdateSupllier={handleUpdateSupllier}
          loading={isUpdating}
        />
      </div>
    </>
  );
};

export default Suplliers;
