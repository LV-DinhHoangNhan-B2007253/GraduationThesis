import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
function BarComent({
  sold,
  reviewCount,
}: {
  sold: number;
  reviewCount: number;
}) {
  const data = {
    labels: ["Số lượng đã bán", "Số lượt đánh giá"],
    datasets: [
      {
        label: "Thống kê sản phẩm",
        data: [sold, reviewCount],
        backgroundColor: ["#4CAF50", "#FFC107"],
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng",
        },
      },
    },
  };
  return <Bar data={data} options={options} />;
}

export default BarComent;
