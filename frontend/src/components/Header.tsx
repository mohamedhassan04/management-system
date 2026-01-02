import React from "react";
import { Avatar, Badge, Dropdown, Space, type MenuProps } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import styles from "../styles/dashboard-layout.module.scss";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiFullscreenExitLine, RiFullscreenFill } from "react-icons/ri";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "../apis/actions/authApi";

interface HeaderComponentProps {
  isFullscreen: any;
  onToggleFullscreen: any;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [logout] = useLogoutMutation();
  const { data: user } = useGetCurrentUserQuery();
  const handleLogout = async () => {
    await logout();
  };

  const menuProps: MenuProps = {
    items: [
      {
        label: "Se déconnecter",
        key: "logout",
        icon: <LogoutOutlined />,
        danger: true,
        onClick: handleLogout,
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
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <RiFullscreenExitLine
                size={20}
                className={styles["ms--header-icon"]}
              />
            ) : (
              <RiFullscreenFill
                size={20}
                className={styles["ms--header-icon"]}
              />
            )}
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
            <div className={styles["ms--header-user"]}>
              <Avatar
                className={styles["ms--header-avatar"]}
                icon={<UserOutlined />}
              />

              <div className={styles["ms--header-user-info"]}>
                <span className={styles["ms--header-user-name"]}>
                  {user?.success.user.name}
                </span>
                <span className={styles["ms--header-user-role"]}>
                  {user?.success.user.role}
                </span>
              </div>
            </div>
          </Dropdown>
        </Space>
      </div>
    </>
  );
};

export default HeaderComponent;
