"use client";

import Spinner from "@/components/Spinner";
import { RootState } from "@/redux/store";
import { useSelect } from "@nextui-org/react";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  return (
    <div className="min-h-screen">
      <h1>{userInfo?._id}</h1>
      <div>asdasdssd</div>
    </div>
  );
}
