import React from "react";
import { Form, Row, Col, Spin, notification } from "antd";
import styles from "../../styles/login.module.scss";
import Input from "../../components/Input";
import Button from "../../components/Button";
import logo from "../../assets/images/icons/logo.svg";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../apis/actions/authApi";

interface LoginProps {
  api: ReturnType<typeof notification.useNotification>[0];
}

const Login: React.FC<LoginProps> = ({ api }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      await login(values).unwrap(); // unwrap() returns a promise
      api.success({
        message: "Connexion réussie",
        description: "Bienvenue ! Vous êtes connecté.",
        placement: "bottomRight",
      });
      navigate("/dashboard");
    } catch (error: any) {
      api.error({
        message: "Erreur de connexion",
        description: error?.data?.message || "Email ou mot de passe incorrect",
        placement: "bottomRight",
      });
    }
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
            <Form layout="vertical" form={form} onFinish={handleLogin}>
              <Form.Item
                label={
                  <div className={styles["ms--label-container"]}>
                    <span>Adresse Email</span>
                  </div>
                }
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Veuillez saisir votre adresse email",
                  },
                ]}
                name="email"
              >
                <Input
                  type="email"
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
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir votre mot de passe",
                  },
                ]}
                name="password"
              >
                <Input
                  type="password"
                  placeholder="Entrer votre mot de passe"
                  className={styles["ms--input"]}
                />
              </Form.Item>

              <Button
                type="submit"
                disabled={isLoading}
                className={styles["ms--login-btn"]}
              >
                <span>{isLoading ? <Spin /> : "Se connecter"}</span>
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
