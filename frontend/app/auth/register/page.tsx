"use client";

import { useState } from "react";
import { IRegisterForm } from "@/interfaces/auth.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeLowVision } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import GoogleButton from "@/components/GoogleButton";
import { RegisterUser } from "@/services/auth.service";
import { toast } from "react-toastify";

function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [formData, setFormData] = useState<IRegisterForm>({
    email: "",
    name: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const HandleSubmit = async (
    event: React.FormEvent<HTMLInputElement> | any
  ) => {
    event.preventDefault();
    try {
      const data = await RegisterUser(formData);

      if (data && data.accessToken) {
        // Lưu token vào local storage và chuyển hướng
        window.location.href = `http://localhost:3000/callback?access_token=${data.accessToken}`;
      }
    } catch (error: any) {
      toast.error(`Register failed ${error}`);
    }
  };

  const handleOnchange = (e: any) => {
    setFormData((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  return (
    <section className="h-screen flex justify-center items-center    ">
      <div className=" shadow-md   sm:min-w-[600px] mx-3 py-20 container sm:mx-96 sm:px-5 rounded-md  bg-card-bg">
        <div>
          <h1 className="text-base  font-bold text-center sm:text-3xl py-2 text-heading">
            Tạo tài khoản
          </h1>
          <p className="text-small sm:text-base text-center text-secondary-500  ">
            Đã có tài khoản?
            <Link
              href={"/auth/login"}
              className=" underline font-bold mx-2 hover:text-accent"
            >
              Đăng nhập ngay{" "}
            </Link>
          </p>
        </div>
        <form onSubmit={HandleSubmit} className="px-4">
          <div className="my-3">
            <label
              htmlFor="email"
              className="block w-fit hover:cursor-pointer hover:font-bold    text-small sm:text-base py-1 text-label"
            >
              Địa chỉ email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleOnchange}
              required={true}
              className="py-2 px-2 text-small sm:text-base w-full rounded  outline-none border  bg-input text-input-text mt-1"
              placeholder="nguyenvana@gmail.com"
            />
          </div>
          <div className="my-3">
            <label
              htmlFor="name"
              className="block w-fit hover:cursor-pointer hover:font-bold    text-small sm:text-base py-1 text-label"
            >
              Your name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleOnchange}
              required={true}
              className="py-2 px-2 text-small sm:text-base w-full rounded  outline-none border  bg-input text-input-text mt-1"
            />
          </div>
          <div className="my-3">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block w-fit hover:cursor-pointer hover:font-bold    text-small sm:text-base py-1 text-label"
              >
                Password
              </label>
              <FontAwesomeIcon
                icon={passwordVisible ? faEye : faEyeLowVision}
                color="#4a4e69"
                size="1x"
                className="hover:cursor-pointer dark:text-white "
                onClick={togglePasswordVisibility}
              />
            </div>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              onChange={handleOnchange}
              required={true}
              className="py-2 px-2 text-small sm:text-base w-full rounded  outline-none border  bg-input text-input-text mt-1"
            />
          </div>

          <button
            type="submit"
            className="my-4 text-center w-full py-2 px-2 text-small sm:text-base tracking-widest border  transition-all bg-primary-500 hover:bg-secondary-500 rounded-md"
          >
            Xác nhận đăng ký
          </button>
        </form>
        <div className="flex items-center">
          <div className="flex-grow border-t border-light-card-border dark:border-dark-border"></div>
          <span className="px-4 text-label">hoặc</span>
          <div className="flex-grow border-t  border-light-card-border dark:border-dark-border"></div>
        </div>
        <div className="flex justify-center mt-4">
          <GoogleButton />
        </div>
      </div>
    </section>
  );
}

export default Register;
