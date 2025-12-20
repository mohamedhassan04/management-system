import React, { useState } from "react";
import {
  Col,
  Form,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Spin,
  type notification,
  type TableColumnsType,
} from "antd";
import styles from "../../styles/clients.module.scss";
import StatusTag from "../../components/StatusTag";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Table from "../../components/Table";
import { HiDocumentAdd } from "react-icons/hi";
import { IoMdSearch } from "react-icons/io";
import AddInvoice from "./AddEstimate";
import { useFindAllClientsQuery } from "../../apis/actions/clientApi";
import { useRemoveInvoiceMutation } from "../../apis/actions/invoiceApi";
import invoice from "../../assets/images/icons/invoice.svg";
import ViewInvoice from "./ViewEstimate";
import { useFindAllProductsQuery } from "../../apis/actions/productApi";
import Select from "../../components/Select";
import { estimateStatus } from "../../data/data";
import { BsFillSendFill } from "react-icons/bs";
import { FcFullTrash } from "react-icons/fc";
import { RiDeleteBin6Fill } from "react-icons/ri";
import {
  useCreateEstimateMutation,
  useFindAllEstimatesQuery,
  useGenerateEstimateMutation,
  useSendEstimateByEmailMutation,
} from "../../apis/actions/estimate";

interface EstimateProps {
  api: ReturnType<typeof notification.useNotification>[0];
}

const Estimate: React.FC<EstimateProps> = ({ api }) => {
  const [form] = Form.useForm();

  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedEstimate, setSelectedEstimate] = useState<null | any>(null);

  const { data: clients } = useFindAllClientsQuery({});
  const { data: products } = useFindAllProductsQuery({});
  const { data, isLoading } = useFindAllEstimatesQuery({
    page,
    limit: 10,
    search: searchTerm,
    status: status,
  });

  const [generateEstimate, { isLoading: isLoadingInvoice }] =
    useGenerateEstimateMutation();

  const [createEstimate, { isLoading: isLoadingCreateInvoice }] =
    useCreateEstimateMutation();

  const [sendEstimateByEmail, { isLoading: isLoadingSendEstimate }] =
    useSendEstimateByEmailMutation();

  const [removeInvoice] = useRemoveInvoiceMutation();

  // Function to add a new estimate
  const handleAddEstimate = async () => {
    try {
      form.validateFields();
      const values = form.getFieldsValue();
      await createEstimate(values).unwrap();
      api.success({
        message: "Nouveau devis ajouté",
        description: "Le devise a été ajouté avec succès.",
        placement: "bottomRight",
      });
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      api.error({
        message: "Erreur d'ajout",
        description:
          (error as any)?.data?.message[0] || "Une erreur est survenue",
        placement: "bottomRight",
      });
    }
  };

  const handleViewEstimate = async (estimateId: string) => {
    try {
      setSelectedEstimate(estimateId);
      const blob = await generateEstimate({ estimateId }).unwrap();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setIsOpen(true);
    } catch (error) {
      api.error({
        message: "Erreur de génération",
        description:
          (error as any)?.data?.message[0] || "Une erreur est survenue",
        placement: "bottomRight",
      });
    }
  };

  const handleSendEstimateByEmail = async (id: string) => {
    try {
      setSelectedEstimate(id);
      await sendEstimateByEmail(id).unwrap();
      api.success({
        message: "Email envoyé",
        description: "L'email a été envoyé avec succès.",
        placement: "bottomRight",
      });
    } catch (error) {
      api.error({
        message: "Erreur de génération",
        description:
          (error as any)?.data?.message[0] || "Une erreur est survenue",
        placement: "bottomRight",
      });
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      await removeInvoice({ id }).unwrap();
      api.success({
        message: "Facture supprimé",
        description: "La facture a été supprimé avec succès.",
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

  const columns: TableColumnsType = [
    {
      title: "Nom de client",
      dataIndex: "client",
      key: "client",
      width: 200,
      render: (client: any) => (
        <span
          className={styles["ms--client-name"]}
        >{`${client?.firstName} ${client?.lastName}`}</span>
      ),
    },
    {
      title: "Numéro de facture",
      dataIndex: "estimateNo",
      key: "estimateNo",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      render: (status: any) => <StatusTag status={status} />,
    },
    {
      title: "Date de devis",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Montant total",
      dataIndex: "total",
      key: "total",
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
            onClick={() => handleSendEstimateByEmail(record.id)}
          >
            {isLoadingSendEstimate && selectedEstimate === record.id ? (
              <Spin size="small" />
            ) : (
              <BsFillSendFill size={18} color="#0077ff" />
            )}
          </button>

          <button
            className={styles["ms--client-actions"]}
            onClick={() => handleViewEstimate(record.id)}
          >
            {isLoadingInvoice && selectedEstimate === record.id ? (
              <Spin size="small" />
            ) : (
              <img src={invoice} alt="invoice" width={18} />
            )}
          </button>

          <Popconfirm
            onConfirm={() => handleDeleteInvoice(record.id)}
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
                Supprimer ce devis
              </span>
            }
            description={
              <span className={styles["ms--popconfirm-description"]}>
                Voulez-vous vraiment supprimer ce devis ?
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
          <h1 className={styles["ms--client-title"]}>Mes devis</h1>
        </Col>
        <Col span={4}>
          <Button
            icon={<HiDocumentAdd />}
            className={styles["ms--client-btn"]}
            onClick={() => setIsModalOpen(true)}
          >
            Créer un devis
          </Button>
        </Col>
      </Row>
      <div className={styles["ms--client-table-container"]}>
        <Row style={{ marginBottom: "1.5rem" }} align="middle" gutter={16}>
          <Col span={20}>
            <Input
              placeholder="Rechercher un devis par nom de client ou numéro de devis..."
              className={styles["ms--client-input"]}
              suffix={<IoMdSearch size={20} />}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>

          <Col span={4}>
            <Select
              placeholder="Status"
              options={estimateStatus?.map((status: any) => ({
                label: status.label,
                value: status.id,
              }))}
              onChange={(e) => {
                setStatus(e);
              }}
              classname={styles["ms--client-select"]}
            />
          </Col>
        </Row>

        <Table
          data={data?.items || []}
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

      <AddInvoice
        isModalOpen={isModalOpen}
        setIsModalOpen={() => setIsModalOpen(false)}
        form={form}
        handleAddInvoice={handleAddEstimate}
        clients={clients?.items}
        products={products?.items}
        loading={isLoadingCreateInvoice}
      />

      <ViewInvoice pdfUrl={pdfUrl} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Estimate;
