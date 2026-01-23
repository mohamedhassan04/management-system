import React from "react";
import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

const devisStats = {
  devisCrees: 120,
  devisAcceptes: 78,
  facturesCreees: 65,
};

const conversionRate = Math.round(
  (devisStats.facturesCreees / devisStats.devisCrees) * 100
);

const DevisToFacturesChart: React.FC = () => {
  const data = {
    labels: ["Devis créés", "Devis acceptés", "Factures créées"],
    datasets: [
      {
        label: "Nombre",
        data: [
          devisStats.devisCrees,
          devisStats.devisAcceptes,
          devisStats.facturesCreees,
        ],
        backgroundColor: ["#60a5fa", "#fbbf24", "#22c55e"],
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          afterBody: () => `Taux de conversion: ${conversionRate}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div>
      <h4 style={{ marginBottom: 12 }}>Devis → Factures ({conversionRate}%)</h4>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DevisToFacturesChart;
