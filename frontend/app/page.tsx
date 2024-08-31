"use client";

import Spinner from "@/components/Spinner";
import { RootState } from "@/redux/store";
import { useSelect } from "@nextui-org/react";
import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  return (
    <Suspense fallback={<Spinner />}>
      {/* Hiển thị thông tin người dùng */}
      <p>{userInfo?._id}</p>
    </Suspense>
  );
}
