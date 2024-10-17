"use client";

import { ClassifyComments } from "@/services/rating.service";
import { useEffect, useState } from "react";

interface IClassedComment {
  comment: string;
  label: number;
}

function ClassifyComment({ comments }: { comments: string[] }) {
  const [classedComment, setClassedComment] = useState<IClassedComment[]>([]);
  const [isSortedAscending, setIsSortedAscending] = useState(true); // Trạng thái theo dõi thứ tự sắp xếp

  const ClassiComment = async (comments: string[]) => {
    if (!Array.isArray(comments) || comments.length === 0) return; // Kiểm tra nếu comments là mảng hợp lệ
    try {
      const data = await ClassifyComments(comments);
      console.log("comment list", data);
      setClassedComment(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSort = () => {
    const sorted = [...classedComment].sort((a, b) =>
      isSortedAscending ? a.label - b.label : b.label - a.label
    );
    setClassedComment(sorted);
    setIsSortedAscending(!isSortedAscending); // Đảo ngược thứ tự sắp xếp
  };

  const getLabelColor = (label: number) => {
    switch (label) {
      case 0:
        return "text-red-500"; // Bad
      case 1:
        return "text-yellow-500"; // Normal
      case 2:
        return "text-green-500"; // Good
      default:
        return "text-black"; // Mặc định
    }
  };

  useEffect(() => {
    ClassiComment(comments);
  }, [comments]);

  return (
    <div>
      <div className="overflow-x-auto w- mt-10">
        <button
          onClick={handleSort}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sort by Label {isSortedAscending ? "(Ascending)" : "(Descending)"}
        </button>
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="text-left py-3 px-6 font-semibold">Comment</th>
              <th className="text-left py-3 px-6 font-semibold w-1/5">Label</th>
            </tr>
          </thead>
          <tbody>
            {classedComment.map((comment: IClassedComment, index: number) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{comment.comment}</td>
                <td
                  className={`py-3 px-6 font-semibold text-sm ${getLabelColor(
                    comment.label
                  )}`}
                >
                  {comment.label === 0
                    ? "Bad"
                    : comment.label === 1
                    ? "Normal"
                    : "Good"}
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
