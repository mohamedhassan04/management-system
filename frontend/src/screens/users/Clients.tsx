import { Col, Form, Pagination, Popconfirm, Row, Space, Spin } from "antd";
import React, { useState } from "react";
import Button from "../../components/Button";
import { HiUserAdd } from "react-icons/hi";
import Table from "../../components/Table";
import styles from "../../styles/clients.module.scss";
import StatusTag from "../../components/StatusTag";
import Input from "../../components/Input";
import Select from "../../components/Select";
import AddClient from "./AddClient";
import { IoIosLock, IoIosUnlock, IoMdSearch } from "react-icons/io";
import { RiDeleteBin6Fill, RiEditFill } from "react-icons/ri";
import { FcFullTrash } from "react-icons/fc";
import EditClient from "./EditClient";
import {
  useCreateClientMutation,
  useFindAllClientsQuery,
  useRemoveClientMutation,
  useUpdateClientMutation,
  useUpdateStatusClientMutation,
} from "../../apis/actions/clientApi";

const Clients: React.FC = () => {
  const [form] = Form.useForm();

  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<null | any>(null);
  const [statusSelected, setStatusSelected] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [updateStatusClient, { isLoading: isUpdatingStatus }] =
    useUpdateStatusClientMutation();
  const [removeClient] = useRemoveClientMutation();

  const { data, isLoading } = useFindAllClientsQuery({
    page: page,
    limit: 5,
    status: searchStatus,
    search: searchTerm,
  });

  // Function to update client data
  const handleUpdateClient = async (id: string, client: any) => {
    try {
      await updateClient({ id, data: client }).unwrap();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to update client status
  const handleUpdateStatus = async (id: string, status: string) => {
    setStatusSelected(id);
    try {
      await updateStatusClient({ id, data: { status } }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  // Function to add a new client
  const handleAddUser = async () => {
    try {
      const values = form.getFieldsValue();
      await createClient(values).unwrap();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  // Function to delete a client
  const handleDeleteClient = async (id: string) => {
    try {
      await removeClient({ id }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  // Function to cancel the edit modal
  const handleCancelEditModal = () => {
    setSelectedClient(null);
    form.resetFields();
    setIsEditModalOpen(false);
  };

  // Function to show the edit modal
  const handleShowEditModal = (client: any) => {
    setSelectedClient(client);
    form.setFieldsValue(client);
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      title: "Nom et prénom",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => (
        <Space size="small">
          <span className={styles["ms--client-name"]}>
            {record.firstName} {record.lastName}
          </span>
        </Space>
      ),
    },
    {
      title: "Téléphone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
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
            onConfirm={() => handleDeleteClient(record.id)}
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
          <button
            className={styles["ms--client-actions"]}
            onClick={() =>
              handleUpdateStatus(
                record.id,
                record.status === "Active" ? "Désactive" : "Active"
              )
            }
          >
            {isUpdatingStatus && statusSelected === record.id ? (
              <Spin size="small" />
            ) : record.status === "Active" ? (
              <IoIosUnlock size={18} color="#14ba83" />
            ) : (
              <IoIosLock size={18} color="#f05858" />
            )}
          </button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col span={20}>
          <h1 className={styles["ms--client-title"]}>Mes clients</h1>
        </Col>
        <Col span={4}>
          <Button
            icon={<HiUserAdd />}
            className={styles["ms--client-btn"]}
            onClick={() => setIsModalOpen(true)}
          >
            Ajouter un client
          </Button>
        </Col>
      </Row>
      <div className={styles["ms--client-table-container"]}>
        <Row style={{ marginBottom: "1.5rem" }} align="middle" gutter={16}>
          <Col span={20}>
            <Input
              placeholder="Rechercher un client par son nom ou son email ou son phone ..."
              className={styles["ms--client-input"]}
              suffix={<IoMdSearch size={20} />}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </Col>

          <Col span={4}>
            <Select
              placeholder="Status"
              options={[
                { value: "Active", label: "Active" },
                { value: "Désactive", label: "Désactive" },
              ]}
              onChange={(e) => {
                setSearchStatus(e);
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

        <AddClient
          isModalOpen={isModalOpen}
          setIsModalOpen={() => setIsModalOpen(false)}
          form={form}
          handleAddUser={handleAddUser}
          loading={isCreating}
        />

        <EditClient
          selectedClient={selectedClient}
          form={form}
          handleUpdateClient={handleUpdateClient}
          isModalEditOpen={isEditModalOpen}
          setIsModalEditOpen={handleCancelEditModal}
          loading={isUpdating}
        />
      </div>
    </>
  );
};

export default Clients;
