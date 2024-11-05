"use client";

import { IOrder } from "@/interfaces/order.interface";
import ProdutOfOrderCard from "./ProdutOfOrderCard";
import { ChangeEvent, useEffect, useState } from "react";
import { UserInfo } from "@/interfaces/auth.interface";
import { GetOneUserById } from "@/services/auth.service";
import { Avatar, button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneSquare } from "@fortawesome/free-solid-svg-icons";
import { faRocketchat } from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";
import { UpdateOrderStatus } from "@/services/order.service";
import { stat } from "fs";
import MakeRating from "./MakeRating";
import ChatBox from "../chat/ChatBox";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useChat from "@/hooks/useChat.hook";

function OrderInfoCard({
  order,
  asAdmin,
  userAction,
}: {
  order: IOrder;
  asAdmin?: boolean;
  userAction?: boolean;
}) {
  const [userOrder, setUserOrder] = useState<UserInfo>();
  const [status, setStatus] = useState<string>(order.status);
  const { userInfo } = useSelector((state: RootState) => state.user);

  // opent rating panel
  const [isOpenRating, setIsOpenRating] = useState<boolean>(false);
  const [isChatbox, setIsChatBox] = useState<boolean>(false);
  // const { joinRoom } = useChat({
  //   senderId: userInfo?._id,
  //   receiverId: userOrder?._id,
  // });
  const fetchUserInfo = async () => {
    try {
      const data = await GetOneUserById(order.user_id);
      setUserOrder(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    try {
      const newStatus = e.target.value;
      setStatus(newStatus);
      const data = await UpdateOrderStatus(order._id, newStatus);
      if (data) {
        toast.success(`${data.message}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleUserCancelOrder = async () => {
    try {
      const cancelStatus = "canceled";
      setStatus(cancelStatus);
      const data = await UpdateOrderStatus(order._id, cancelStatus);
      toast.success("Cancel success");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleSendReview = async () => {
    try {
      const reviewedStatus = "reviewed";
      setStatus(reviewedStatus);
      setIsOpenRating(false);
      const data = await UpdateOrderStatus(order._id, reviewedStatus);
      toast.success("Thanks for your review");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  // useEffect(() => {
  //   if (isChatbox && userOrder) {
  //     joinRoom();
  //   }
  // }, [isChatbox, userOrder, joinRoom]);

  useEffect(() => {
    if (asAdmin === true) {
      fetchUserInfo();
    }
  }, [order]);

  return (
    <div>
      {userOrder && (
        <div className="flex justify-between gap-6 items-center border-b border-gray-50 dark:border-gray-700 py-2 px-3">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faPhoneSquare} />
            <p>{userOrder.phone_number}</p>
          </div>

          <div className="flex items-center gap-10">
            <p>{userOrder.name}</p>
            <Avatar src={userOrder.avatarUrl} />
          </div>
        </div>
      )}
      <ProdutOfOrderCard orderProducts={order.products} />

      <div className="flex justify-around items-center px-4 py-2 flex-wrap capitalize text-light-primary-text dark:text-dark-primary-text text-small sm:text-base">
        <p>Order Code: {order._id}</p>
        <p>Order Date: {new Date(order.order_date).toLocaleString()}</p>
        <p>Total Price: {order.total_price}</p>
        <p>Status: {status}</p>
      </div>
      {status === "pending" && userAction === true ? (
        <div className="flex justify-end items-center my-4">
          <button
            onClick={handleUserCancelOrder}
            className="px-4 py-2 text-center bg-orange-700 hover:bg-orange-500 transition duration-300 ease-in-out text-white uppercase"
          >
            Cacel Order
          </button>
        </div>
      ) : status === "shipped" && userAction === true ? (
        <div className="flex justify-end items-center my-4">
          {isOpenRating ? (
            <button
              onClick={() => setIsOpenRating(!isOpenRating)}
              className="px-4 py-2 text-center bg-green-700  transition duration-300 ease-in-out text-white uppercase hover:bg-green-500"
            >
              Close
            </button>
          ) : (
            <button
              onClick={() => setIsOpenRating(!isOpenRating)}
              className="px-4 py-2 text-center bg-green-700  transition duration-300 ease-in-out text-white uppercase hover:bg-green-500"
            >
              Rating
            </button>
          )}
        </div>
      ) : status === "canceled" && userAction === true ? (
        <div className="flex justify-end items-center my-4">
          <button
            // onClick={handleUserCancelOrder}
            className="px-4 py-2 text-center bg-gray-700  transition duration-300 ease-in-out text-white uppercase cursor-not-allowed"
          >
            Canceled
          </button>
        </div>
      ) : status === "reviewed" && userAction === true ? (
        <div className="flex justify-end items-center my-4">
          <button
            // onClick={handleUserCancelOrder}
            className="px-4 py-2 text-center bg-gray-700  transition duration-300 ease-in-out text-white uppercase cursor-not-allowed"
          >
            Reviewed
          </button>
        </div>
      ) : (
        userAction === true && (
          <div className="flex justify-end items-center my-4">
            <button
              // onClick={handleUserCancelOrder}
              className="px-4 py-2 text-center bg-gray-500  transition duration-300 ease-in-out text-white uppercase cursor-not-allowed"
            >
              Delivery
            </button>
          </div>
        )
      )}
      <div className={`${isOpenRating ? "block" : "hidden"}`}>
        {order.products.map((pro) => (
          <MakeRating
            productId={pro.product_id}
            key={pro.product_id}
            userId={order.user_id}
          />
        ))}
        <button
          onClick={handleSendReview}
          className="w-full py-2 text-center text-base tracking-widest font-bold underline hover:tracking-[0.2em] transition-all duration-100"
        >
          send
        </button>
      </div>
      {asAdmin && (
        <div className="flex items-center justify-end gap-14 px-4 py-2 mt-2">
          <select
            className="min-w-[200px] text-center capitalize text-small sm:text-base border border-light-card-border dark:border-dark-card-border rounded hover:cursor-pointer px-1 py-2 "
            name="status"
            id="status"
            value={status}
            onChange={handleStatusChange}
            // onBlur={handleStatusChange}
          >
            <option value="delivery">delivery</option>
            <option value="shipped">shipped</option>
            <option value="canceled">canceled</option>
            <option value="pending">pending</option>
          </select>
          <FontAwesomeIcon
            onClick={() => setIsChatBox(true)}
            icon={faRocketchat}
            className="textbase sm:text-2xl hover:text-blue-600 hover:cursor-pointer"
          />

          <div className="fixed bottom-0 right-5 z-20 bg-light-modal-popup p-4">
            {isChatbox && (
              <div>
                <ChatBox senderId={userInfo?._id} receiverId={userOrder?._id} />
                <button onClick={() => setIsChatBox(false)}>close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderInfoCard;
