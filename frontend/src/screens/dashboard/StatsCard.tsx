import React from "react";
import { FileText, Receipt, Users, Truck } from "lucide-react";
import styles from "../../styles/dashboard.module.scss";

type StatItem = {
  label: string;
  value: number;
  hint: string;
  gradient: string;
  icon: React.ReactNode;
};

const stats: StatItem[] = [
  {
    label: "Devis",
    value: 120,
    hint: "Devis générés",
    gradient: "linear-gradient(135deg, #2563eb, #60a5fa)",
    icon: <FileText size={22} />,
  },
  {
    label: "Factures",
    value: 98,
    hint: "Factures émises",
    gradient: "linear-gradient(135deg, #16a34a, #4ade80)",
    icon: <Receipt size={22} />,
  },
  {
    label: "Clients",
    value: 54,
    hint: "Clients actifs",
    gradient: "linear-gradient(135deg, #7c3aed, #c084fc)",
    icon: <Users size={22} />,
  },
  {
    label: "Fournisseurs",
    value: 18,
    hint: "Partenaires",
    gradient: "linear-gradient(135deg, #ea580c, #fb923c)",
    icon: <Truck size={22} />,
  },
];

const StatsCards: React.FC = () => {
  return (
    <div className={styles.grid}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={styles.card}
          style={{ background: stat.gradient }}
        >
          {/* Glow / shine overlay */}
          <div className={styles.overlay} />

          {/* Icon watermark */}
          <div className={styles.iconBg}>{stat.icon}</div>

          <div className={styles.content}>
            <div className={styles.top}>
              <span className={styles.label}>{stat.label}</span>
              <span className={styles.icon}>{stat.icon}</span>
            </div>

            <span className={styles.value}>{stat.value}</span>
            <span className={styles.hint}>{stat.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
