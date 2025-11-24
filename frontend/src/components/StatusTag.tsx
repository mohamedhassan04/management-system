import React from "react";
import styles from "../styles/tag.module.scss";

const StatusTag: React.FC<{ status: string }> = ({ status }) => {
  const key = status.toLowerCase().replace(/\s+/g, "-");
  return (
    <span className={`${styles.badge} ${styles[key]}`}>
      <span className={styles.dot} />
      {status}
    </span>
  );
};

export default StatusTag;
