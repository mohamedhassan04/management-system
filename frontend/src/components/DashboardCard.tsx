import { Card } from "antd";
import styles from "../styles/dashboard.module.scss";

interface DashboardCardProps {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  height?: number | string;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  extra,
  children,
  height = 300,
  loading = false,
}) => {
  return (
    <Card
      title={title}
      extra={extra}
      loading={loading}
      style={{ height }}
      className={styles["ms--dashboard-card-container"]}
    >
      {children}
    </Card>
  );
};

export default DashboardCard;
