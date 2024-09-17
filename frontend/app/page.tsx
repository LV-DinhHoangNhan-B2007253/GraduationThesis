"use client";

import Spinner from "@/components/Spinner";
import MainLayout from "@/layouts/MainLayout";
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
    <MainLayout>
      <section className="min-h-screen">section 1</section>
      <section className="min-h-screen">section 2</section>
    </MainLayout>
  );
}
