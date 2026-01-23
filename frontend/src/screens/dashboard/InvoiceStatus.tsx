import React from "react";
import { Doughnut } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

const invoiceStats = {
  paidCount: 42,
  unpaidCount: 18,
  partiellyPaidCount: 15,
  unpaidAmount: 12500,
};

const InvoiceStatus: React.FC = () => {
  const data = {
    labels: [
      "Factures payées",
      "Factures partiellement payées",
      "Factures impayées",
    ],
    datasets: [
      {
        data: [
          invoiceStats.paidCount,
          invoiceStats.partiellyPaidCount,
          invoiceStats.unpaidCount,
        ],
        backgroundColor: ["#14ba83", "#0077ff", "#f05858"],
        borderWidth: 0,
        cutout: "60%",
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 10,

          generateLabels(chart) {
            return chart.data.labels!.map((label, i) => ({
              text: String(label).replace("Factures ", ""),
              fillStyle: (chart.data.datasets[0].backgroundColor as string[])[
                i
              ],
              hidden: false,
              index: i,
              color: "#656c8c",
            }));
          },
        },
      },
    },
  };

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart: any) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const { top, bottom, left, right } = chartArea;
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // ctx.font = "600 12px IBMPlexSans";
      ctx.fillStyle = "#656c8c";
      ctx.fillText("Montant impayé", centerX, centerY - 10);

      // ctx.font = "700 16px IBMPlexSans";
      ctx.fillStyle = "#f05858";
      ctx.fillText(
        `${invoiceStats.unpaidAmount.toLocaleString()} DT`,
        centerX,
        centerY + 12
      );

      ctx.restore();
    },
  };

  return (
    <div>
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
};

export default InvoiceStatus;
