import { Col, Row, type notification } from "antd";
import React from "react";
import styles from "../../styles/dashboard.module.scss";
import { useGetCurrentUserQuery } from "../../apis/actions/authApi";
import InvoiceStatus from "./InvoiceStatus";
import DashboardCard from "../../components/DashboardCard";
import DevisToFacturesChart from "./DevisToInvoiceChart";
import StatsCards from "./StatsCard";

interface DashboardProps {
  api: ReturnType<typeof notification.useNotification>[0];
}

const Dashboard: React.FC<DashboardProps> = ({ api }) => {
  const { data: user } = useGetCurrentUserQuery();
  return (
    <div>
      {/* <h1 className={styles["ms--dashboard-title"]}>
        Bonne retour <span>{user?.success.user.name}</span> 👋
      </h1> */}
      <StatsCards />
      <Row gutter={[16, 16]} className={styles["ms--dashboard-cards"]}>
        <Col span={8}>
          <DashboardCard title="Status des factures" height={"100%"}>
            <InvoiceStatus />
          </DashboardCard>
        </Col>
        <Col span={16}>
          <DashboardCard title="Devis → Factures" height={"100%"}>
            <DevisToFacturesChart />
          </DashboardCard>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
