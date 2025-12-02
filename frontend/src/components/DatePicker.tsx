import React from "react";
import { DatePicker as AntDatePicker, ConfigProvider } from "antd";
import styles from "../styles/input.module.scss";
import frFR from "antd/es/locale/fr_FR";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

interface DatePickerProps {
  placeholder?: string;
  onChange?: (date: any, dateString: string | string[]) => void;
  value?: any;
  format?: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  placeholder = "Sélectionner une date",
  onChange,
  value,
  format = "YYYY-MM-DD",
  disabled = false,
}) => {
  return (
    <ConfigProvider locale={frFR}>
      <AntDatePicker
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        format={format}
        disabled={disabled}
        defaultValue={dayjs(Date.now())}
        className={styles["ms--date-picker"]}
      />
    </ConfigProvider>
  );
};

export default DatePicker;
