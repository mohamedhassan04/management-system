import React, { useState } from "react";
import { Form, Row, Col, Spin } from "antd";
import styles from "../../styles/login.module.scss";
import Input from "../../components/Input";
import Button from "../../components/Button";
import logo from "../../assets/images/icons/logo.svg";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log("Login done!");
    }, 2000);

    navigate("/dashboard");
  };

  return (
    <div className={styles["ms--container"]}>
      <Row justify="center" align="middle" className={styles["ms--row"]}>
        <Col xxl={6} xl={8} lg={16} md={16} sm={16} xs={22}>
          <div className={styles["ms--card"]}>
            <div className={styles["ms--logo-container"]}>
              <img src={logo} alt="logo" loading="lazy" />
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

              <Button
                onClick={handleLogin}
                disabled={loading}
                className={styles["ms--login-btn"]}
              >
                <span>{loading ? <Spin /> : "Se connecter"}</span>
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
