import React from "react";
import styles from "../styles/table.module.scss";
import { Empty, Table as AntTable } from "antd";
import type { ColumnsType } from "antd/es/table";

interface ReusableTableProps {
  columns: ColumnsType<any>;
  data: any[];
  rowKey?: string;
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  scroll?: any;
}

const CustomEmpty = () => (
  <Empty
    image={""}
    description={
      <span className={styles["ms--no-data-text"]}>Aucun données trouvées</span>
    }
  />
);

const Table: React.FC<ReusableTableProps> = ({
  columns,
  data,
  rowKey = "id",
  loading = false,
  pagination,
  pageSize = 6,
  scroll,
}) => {
  return (
    <AntTable
      locale={{ emptyText: <CustomEmpty /> }}
      className={styles["ms--table"]}
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={rowKey}
      pagination={pagination ? { pageSize } : false}
      scroll={scroll}
    />
  );
};

export default Table;
