"use client";

import { setLogged } from "@/redux/slices/isLoginStateSlice";
import { GetNSetUserInfo } from "@/redux/slices/userInfoSlice";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function Callback() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    console.log("token tra ve", accessToken);

    if (accessToken) {
      // Lưu token vào localStorage hoặc bất kỳ nơi lưu trữ nào khác
      localStorage.setItem("accessToken", accessToken);

      // gọi api qua thunk và set info vào store, đặt trạng thái đăng nhập
      dispatch(GetNSetUserInfo());
      dispatch(setLogged());

      // Chuyển hướng đến trang chính hoặc trang khác
      router.push("/");
    }
  }, [router, dispatch]);

  return <div>Đang tải...</div>;
}

export default Callback;
