import { Spin } from "antd";
import React from "react";
import styles from "../styles/loading.module.scss";

const LoadingScreen: React.FC = () => (
  <div className={styles["ms--loading-container"]}>
    <Spin size="large" className={styles["ms--loading"]} />
    <p className={styles["ms--loading-text"]}>Chargement en cours</p>
  </div>
);

export default LoadingScreen;
