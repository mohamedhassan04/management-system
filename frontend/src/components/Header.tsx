import React from "react";
import { Avatar, Badge, Dropdown, Space, type MenuProps } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import styles from "../styles/dashboard-layout.module.scss";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";

const HeaderComponent: React.FC = () => {
  const menuProps: MenuProps = {
    items: [
      {
        label: "Se déconnecter",
        key: "logout",
        icon: <LogoutOutlined />,
        danger: true,
      },
    ],
  };
  return (
    <>
      <div className={styles["ms--header-container"]}>
        <Space align="center" size="middle">
          <button
            aria-label="Settings"
            className={styles["ms--header-icon-btn"]}
          >
            <IoSettingsOutline className={styles["ms--header-icon"]} />
          </button>
          <Badge
            status="success"
            count={1}
            color="#f05858"
            className={styles["ms--header-badge"]}
          >
            <button
              aria-label="Notifications"
              className={styles["ms--header-icon-btn"]}
            >
              <IoMdNotificationsOutline className={styles["ms--header-icon"]} />
            </button>
          </Badge>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <Avatar
              className={styles["ms--header-avatar"]}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Space>
      </div>
    </>
  );
};

export default HeaderComponent;
