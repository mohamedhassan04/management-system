import { Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router";
import logo from "../assets/images/icons/logo.svg";
import { items } from "../data/data";
import styles from "../styles/dashboard-layout.module.scss";
import HeaderComponent from "../components/Header";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const { Sider, Content, Header } = Layout;

const DashboardLayout = () => {
  const handle = useFullScreenHandle();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <FullScreen handle={handle}>
      <Layout className={styles["ms--layout"]}>
        <Sider width={240} className={styles["ms--layout-sidebar"]}>
          <div className={styles["ms--layout-logo"]}>
            <img src={logo} alt="ms" loading="lazy" />
            <div>
              <p className={styles["ms--layout-logo-text"]}>TijaraSys</p>
              <p className={styles["ms--layout-logo-slogan"]}>
                Le stock sous contrôle
              </p>
            </div>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={items}
            onClick={({ key }) => navigate(key)}
            className={styles["ms--layout-menu"]}
          />
        </Sider>

        <Layout className={styles["ms--layout-contentWrapper"]}>
          <Header className={styles["ms--layout-header"]}>
            <HeaderComponent
              isFullscreen={handle.active}
              onToggleFullscreen={() =>
                handle.active ? handle.exit() : handle.enter()
              }
            />
          </Header>

          <Content className={styles["ms--layout-content"]}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </FullScreen>
  );
};

export default DashboardLayout;
