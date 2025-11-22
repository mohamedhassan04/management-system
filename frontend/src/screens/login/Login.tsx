import React from "react";
import { Form, Row, Col } from "antd";
import styles from "../../styles/login.module.scss";
import Input from "../../components/Input";
import Button from "../../components/Button";
import logo from "../../assets/images/icons/logo.svg";

const Login: React.FC = () => {
  return (
    <div className={styles["ms--container"]}>
      <Row justify="center" align="middle" className={styles["ms--row"]}>
        <Col xxl={6} xl={8} lg={8} md={12} sm={16} xs={22}>
          <div className={styles["ms--card"]}>
            <div className={styles["ms--logo-container"]}>
              <img src={logo} alt="logo" />
            </div>
            <h2 className={styles["ms--title"]}>
              Connectez-vous à votre compte
            </h2>
            <p className={styles["ms--subtitle"]}>
              Bienvenue ! Veuillez saisir vos informations.
            </p>

            <Form layout="vertical">
              <Form.Item
                label={
                  <div className={styles["ms--label-container"]}>
                    <span>Adresse Email</span>
                  </div>
                }
                name="email"
              >
                <Input
                  placeholder="Entrer votre email"
                  className={styles["ms--input"]}
                />
              </Form.Item>

              <Form.Item
                label={
                  <div className={styles["ms--label-container"]}>
                    <span>Mot de passe</span>
                  </div>
                }
                name="password"
              >
                <Input
                  type="password"
                  placeholder="Entrer votre mot de passe"
                  className={styles["ms--input"]}
                />
              </Form.Item>

              <Button className={styles["ms--login-btn"]}>
                <span>Se connecter</span>
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
