import type { notification } from "antd";
import React from "react";
import styles from "../../styles/dashboard.module.scss";
import { useGetCurrentUserQuery } from "../../apis/actions/authApi";

interface DashboardProps {
  api: ReturnType<typeof notification.useNotification>[0];
}

const Dashboard: React.FC<DashboardProps> = ({ api }) => {
  const { data: user } = useGetCurrentUserQuery();
  return (
    <div>
      <h1 className={styles["ms--dashboard-title"]}>
        Bonne retour <span>{user?.success.user.name}</span> 👋
      </h1>
    </div>
  );
};

export default Dashboard;
