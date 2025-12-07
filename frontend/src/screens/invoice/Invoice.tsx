import React, { useState } from "react";
import {
  Col,
  Form,
  Pagination,
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
import AddInvoice from "./AddInvoice";
import { useFindAllClientsQuery } from "../../apis/actions/clientApi";
import {
  useCreateInvoiceMutation,
  useFindAllInvoicesQuery,
  useGenerateInvoiceMutation,
  useSendReminderPaymentEmailMutation,
} from "../../apis/actions/invoiceApi";
import invoice from "../../assets/images/icons/invoice.svg";
import ViewInvoice from "./ViewInvoice";
import { useFindAllProductsQuery } from "../../apis/actions/productApi";
import Select from "../../components/Select";
import { paymentStatus } from "../../data/data";
import { BsFillSendFill } from "react-icons/bs";

interface InvoiceProps {
  api: ReturnType<typeof notification.useNotification>[0];
}

const Invoice: React.FC<InvoiceProps> = ({ api }) => {
  const [form] = Form.useForm();

  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<null | any>(null);

  const { data: clients } = useFindAllClientsQuery({});
  const { data: products } = useFindAllProductsQuery({});
  const { data, isLoading } = useFindAllInvoicesQuery({
    page,
    limit: 10,
    search: searchTerm,
    status: status,
  });

  const [generateInvoice, { isLoading: isLoadingInvoice }] =
    useGenerateInvoiceMutation();

  const [createInvoice, { isLoading: isLoadingCreateInvoice }] =
    useCreateInvoiceMutation();

  const [
    sendReminderPaymentEmail,
    { isLoading: isLoadingSendReminderPaymentEmail },
  ] = useSendReminderPaymentEmailMutation();

  // Function to add a new invoice
  const handleAddInvoice = async () => {
    try {
      form.validateFields();
      const values = form.getFieldsValue();
      await createInvoice(values).unwrap();
      api.success({
        message: "Nouveau facture ajouté",
        description: "La facture a été ajouté avec succès.",
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

  const handleViewInvoice = async (factureId: string) => {
    try {
      setSelectedInvoice(factureId);
      const blob = await generateInvoice({ factureId }).unwrap();
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

  const handleSendReminderEmail = async (id: string) => {
    try {
      setSelectedInvoice(id);
      await sendReminderPaymentEmail(id).unwrap();
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
      dataIndex: "invoiceNo",
      key: "invoiceNo",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      render: (status: any) => <StatusTag status={status} />,
    },
    {
      title: "Date d'écheance",
      dataIndex: "dueDate",
      key: "dueDate",
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
            onClick={() => handleSendReminderEmail(record.id)}
          >
            {isLoadingSendReminderPaymentEmail &&
            selectedInvoice === record.id ? (
              <Spin size="small" />
            ) : (
              <BsFillSendFill size={18} color="#0077ff" />
            )}
          </button>

          <button
            className={styles["ms--client-actions"]}
            onClick={() => handleViewInvoice(record.id)}
          >
            {isLoadingInvoice && selectedInvoice === record.id ? (
              <Spin size="small" />
            ) : (
              <img src={invoice} alt="invoice" width={18} />
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
          <h1 className={styles["ms--client-title"]}>Mes factures</h1>
        </Col>
        <Col span={4}>
          <Button
            icon={<HiDocumentAdd />}
            className={styles["ms--client-btn"]}
            onClick={() => setIsModalOpen(true)}
          >
            Créer une facture
          </Button>
        </Col>
      </Row>
      <div className={styles["ms--client-table-container"]}>
        <Row style={{ marginBottom: "1.5rem" }} align="middle" gutter={16}>
          <Col span={20}>
            <Input
              placeholder="Rechercher une facture par nom de client ou numéro de facture..."
              className={styles["ms--client-input"]}
              suffix={<IoMdSearch size={20} />}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>

          <Col span={4}>
            <Select
              placeholder="Status"
              options={paymentStatus?.map((status: any) => ({
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
        handleAddInvoice={handleAddInvoice}
        clients={clients?.items}
        products={products?.items}
        loading={isLoadingCreateInvoice}
      />

      <ViewInvoice pdfUrl={pdfUrl} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Invoice;
