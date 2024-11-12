import { IComment } from "@/interfaces/comment.interface";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// Đăng ký các thành phần cần thiết
ChartJS.register(ArcElement, Tooltip, Legend);
function PieComment({ comments }: { comments: IComment[] }) {
  const [dataValues, setDataValues] = useState<number[]>([]);

  useEffect(() => {
    // Đếm số lượng từng loại rating
    const veryBad = comments.filter((c) => c.rating === 1).length;
    const Bad = comments.filter((c) => c.rating === 2).length;
    const neutral = comments.filter((c) => c.rating === 3).length;
    const good = comments.filter((c) => c.rating === 4).length;
    const veryGood = comments.filter((c) => c.rating === 5).length;

    setDataValues([veryBad, Bad, neutral, good, veryGood]);
  }, [comments]);

  const data = {
    labels: [
      "Rất không hài lòng",
      "Không hài lòng",
      "Bình Thường",
      "Khá hài lòng",
      "Rất hài lòng",
    ],
    datasets: [
      {
        label: "Phân phối đánh giá",
        data: dataValues,
        backgroundColor: [
          "#d90429",
          "#f4a261",
          "#fcbf49",
          "#a7c957",
          "#1e6091",
        ],
        borderColor: ["#d90429", "#f4a261", "#fcbf49", "#a7c957", "#1e6091"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };
  return <Pie data={data} options={options} />;
}

export default PieComment;
