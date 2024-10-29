import { IOrder } from "@/interfaces/order.interface";
import Link from "next/link";

function OrderItem({
  order,
  getStatusClass,
}: {
  order: IOrder;
  getStatusClass: (status: string) => string;
}) {
  return (
    <tr
      key={order._id}
      className="border-b hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <td className="border border-gray-300 p-2">
        <Link
          href={`/order/${order._id}`}
          className="underline text-indigo-600"
        >
          {order._id}
        </Link>
      </td>
      <td
        className={`border border-gray-300 p-2 ${getStatusClass(order.status)}`}
      >
        {order.status}
      </td>
      <td className="border border-gray-300 p-2">{order.payment_status}</td>
      <td className="border border-gray-300 p-2">{order.payment_method}</td>
    </tr>
  );
}

export default OrderItem;
