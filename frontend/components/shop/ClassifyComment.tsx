"use client";

import {
  ClassifyComments,
  ClassifyCommentWithMethod,
} from "@/services/rating.service";
import { useEffect, useState } from "react";

interface IClassedComment {
  comment: string;
  label: number;
}

function ClassifyComment({ comments }: { comments: string[] }) {
  const [classedComment, setClassedComment] = useState<IClassedComment[]>([]);
  const [isSortedAscending, setIsSortedAscending] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("logistic");
  const [goodCount, setGoodCount] = useState(0);
  const [badCount, setBadCount] = useState(0);
  const [neutralCount, setNeutralCount] = useState(0);

  const ClassiComment = async (comments: string[], method: string) => {
    if (!Array.isArray(comments) || comments.length === 0) return;
    try {
      const data = await ClassifyCommentWithMethod(comments, method); // Gửi API với method
      console.log("comment list", data);
      setClassedComment(data);
      updateStatistics(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSort = () => {
    const sorted = [...classedComment].sort((a, b) =>
      isSortedAscending ? a.label - b.label : b.label - a.label
    );
    setClassedComment(sorted);
    setIsSortedAscending(!isSortedAscending);
  };

  const updateStatistics = (comments: IClassedComment[]) => {
    let good = 0,
      bad = 0,
      neutral = 0;
    comments.forEach((comment) => {
      if (comment.label < 3) bad++;
      else if (comment.label === 3) neutral++;
      else good++;
    });
    setGoodCount(good);
    setBadCount(bad);
    setNeutralCount(neutral);
  };

  const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const method = event.target.value;
    setSelectedMethod(method);
    ClassiComment(comments, method); // Gọi lại API khi phương pháp phân loại thay đổi
  };

  const getLabelColor = (label: number) => {
    switch (label) {
      case 1:
      case 2:
        return "text-red-500"; // Bad
      case 3:
        return "text-yellow-500"; // Neutral
      case 4:
      case 5:
        return "text-green-500"; // Good
      default:
        return "text-black"; // Mặc định
    }
  };

  useEffect(() => {
    ClassiComment(comments, selectedMethod);
  }, [comments, selectedMethod]);

  return (
    <div>
      <div className="flex items-center gap-4">
        <div>
          <select
            value={selectedMethod}
            onChange={handleMethodChange}
            className="px-3 py-2 border rounded"
          >
            <option value="logistic">Logistic Regression</option>
            <option value="knn">KNN</option>
            <option value="svm">SVM</option>
            <option value="random_forest">Random Forest</option>
          </select>
        </div>

        <div>
          <button
            onClick={handleSort}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sort by Label {isSortedAscending ? "(Ascending)" : "(Descending)"}
          </button>
        </div>
      </div>

      <div className="mb-4 text-lg font-semibold flex justify-end items-center gap-4">
        <p>
          Good: <span className="text-green-500">{goodCount}</span>
        </p>
        <p>
          Neutral: <span className="text-orange-500">{neutralCount}</span>
        </p>
        <p>
          Bad: <span className="text-red-500">{badCount}</span>
        </p>
      </div>

      <div className="overflow-x-auto w-full mt-10">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-light-modal-popup dark:bg-dark-modal-popup text-light-primary-text dark:text-dark-primary-text">
              <th className="text-left py-3 px-6 font-semibold">Comment</th>
              <th className="text-left py-3 px-6 font-semibold w-1/5">Label</th>
            </tr>
          </thead>
          <tbody>
            {classedComment.map((comment: IClassedComment, index: number) => (
              <tr
                key={index}
                className="border-b bg-light-modal-popup dark:bg-dark-modal-popup "
              >
                <td className="py-3 px-6">{comment.comment}</td>
                <td
                  className={`py-3 px-6 font-semibold text-sm ${getLabelColor(
                    comment.label
                  )}`}
                >
                  {comment.label < 3
                    ? "Bad"
                    : comment.label > 3
                    ? "Good"
                    : "Neutral"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClassifyComment;
