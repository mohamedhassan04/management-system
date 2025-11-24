import { Col, Form, Pagination, Popconfirm, Row, Space } from "antd";
import React, { useState } from "react";
import Button from "../../components/Button";
import { HiUserAdd } from "react-icons/hi";
import Table from "../../components/Table";
import styles from "../../styles/clients.module.scss";
import StatusTag from "../../components/StatusTag";
import Input from "../../components/Input";
import Select from "../../components/Select";
import AddClient from "./AddClient";
import { IoMdSearch } from "react-icons/io";
import { RiDeleteBin6Fill, RiEditFill } from "react-icons/ri";
import { TbLock } from "react-icons/tb";
import { FcFullTrash } from "react-icons/fc";

const Clients: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddUser = () => {};
  const columns = [
    {
      title: "Client",
      dataIndex: "name",
      key: "name",
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
      render: (status: any) => <StatusTag status={status} />,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: () => (
        <Space size="small">
          <button className={styles["ms--client-actions"]}>
            <RiEditFill size={18} color="#656c8c" />
          </button>
          <Popconfirm
            okText="Oui"
            cancelText="Non"
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
          <button className={styles["ms--client-actions"]}>
            {data && data.map((item: any) => item.status === "active") ? (
              <TbLock size={18} color="green" />
            ) : (
              <TbLock size={18} color="#f05858" />
            )}
          </button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      name: "Ahmed Ben Salem",
      phone: "+216 98 123 456",
      email: "ahmed.bensalem@example.com",
      status: "active",
    },
    {
      key: "2",
      name: "Salma Trabelsi",
      phone: "+216 96 234 789",
      email: "salma.trabelsi@example.com",
      status: "inactive",
    },
    {
      key: "3",
      name: "Mohamed Jaziri",
      phone: "+216 97 345 678",
      email: "mohamed.jaziri@example.com",
      status: "active",
    },
    {
      key: "4",
      name: "Lina Mhiri",
      phone: "+216 95 456 123",
      email: "lina.mhiri@example.com",
      status: "active",
    },
    {
      key: "5",
      name: "Walid Bouazizi",
      phone: "+216 98 567 234",
      email: "walid.bouazizi@example.com",
      status: "inactive",
    },
    // {
    //   key: "6",
    //   name: "Ines Kallel",
    //   phone: "+216 97 678 345",
    //   email: "ines.kallel@example.com",
    //   status: "active",
    // },
    // {
    //   key: "7",
    //   name: "Sofiene Gharbi",
    //   phone: "+216 96 789 456",
    //   email: "sofiene.gharbi@example.com",
    //   status: "inactive",
    // },
    // {
    //   key: "8",
    //   name: "Rania Saidi",
    //   phone: "+216 95 890 567",
    //   email: "rania.saidi@example.com",
    //   status: "active",
    // },
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
          <Col span={16}>
            <Input
              placeholder="Rechercher un client"
              className={styles["ms--client-input"]}
              suffix={<IoMdSearch size={20} />}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Ville"
              options={[]}
              classname={styles["ms--client-select"]}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Status"
              options={[]}
              classname={styles["ms--client-select"]}
            />
          </Col>
        </Row>

        <Table data={data} columns={columns} rowKey="id" />
        <Pagination
          align="center"
          defaultCurrent={1}
          total={200}
          showSizeChanger={false}
          className={styles["ms--client-pagination"]}
          responsive
        />

        <AddClient
          isModalOpen={isModalOpen}
          setIsModalOpen={() => setIsModalOpen(false)}
          form={form}
          handleAddUser={handleAddUser}
        />
      </div>
    </>
  );
};

export default Clients;
