"use client";

import { IUser } from "@/interfaces/auth.interface";
import { RootState } from "@/redux/store";
import { useSelect } from "@nextui-org/react";
import { stat } from "fs";
import { useState } from "react";
import { useSelector } from "react-redux";

function ProductManageShop() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  return <div>ProductManageShop</div>;
}

export default ProductManageShop;
