"use client";

import GoogleButton from "@/components/GoogleButton";
import { ILoginFrom } from "@/interfaces/auth.interface";
import { LoginUser } from "@/services/auth.service";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeLowVision } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginForm, setLoginForm] = useState<ILoginFrom>({
    email: "",
    password: "",
  });
  const isFormValid = loginForm.email !== "" && loginForm.password !== "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement> | any) => {
    event.preventDefault();
    try {
      const res = await LoginUser(loginForm);
      if (res && res.accessToken) {
        // Đảm bảo kiểm tra res có tồn tại
        window.location.href = `http://localhost:3000/callback?access_token=${res.accessToken}`;
      }
    } catch (error) {
      toast.error(`Login Failed: ${error}`);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <section className="flex justify-center items-center h-screen ">
      <div className=" rounded-lg  sm:min-w-[640px] w-[90%] sm:max-w-[640px] px-4 sm:px-10 py-4 sm:py-14 shadow-lg bg-card-bg">
        <div>
          <h1 className=" font-bold text-2xl sm:text-3xl text-center text-primary-600">
            Đăng Nhập
          </h1>
          <p className="text-center text-secondary-700 sm:text-base my-4">
            Bạn chưa có tài khoản?
            <Link
              href={"/auth/register"}
              className="mx-1 font-bold hover:text-accent"
            >
              Đăng ký tại đây
            </Link>
          </p>
          <form onSubmit={handleLogin} className="sm:px-3">
            <div className="my-3">
              <label htmlFor="email" className=" c">
                Địa chỉ Email
              </label>
              <input
                onChange={handleChange}
                tabIndex={1}
                type="email"
                id="email"
                name="email"
                placeholder="nguyenvana@gmail.com"
                className="w-full px-2 py-3 rounded-sm border  my-1 bg-input text-input-text"
              />
            </div>
            <div className="my-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-small sm:text-base hover:cursor-pointer my-1 sm:my-2 text-label"
                >
                  Mật khẩu
                </label>
                <FontAwesomeIcon
                  icon={passwordVisible ? faEye : faEyeLowVision}
                  size="1x"
                  className="hover:cursor-pointer dark:text-dark-primary-text text-light-primary-text"
                  onClick={togglePasswordVisibility}
                />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                onChange={handleChange}
                tabIndex={2}
                id="password"
                name="password"
                className="w-full px-2 py-3 rounded-sm border  my-1 bg-input text-input-text"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`text-center text-light-btn-text ${
                  isFormValid
                    ? " cursor-pointer bg-primary-500 hover:bg-secondary-500"
                    : "bg-gray-400 cursor-not-allowed"
                } py-2 px-1 rounded-[40px] w-[50%] sm:w-full mt-4`}
              >
                Đăng Nhập
              </button>
            </div>
          </form>
        </div>
        <div>
          <div className="flex items-center">
            <div className="flex-grow border-t "></div>
            <span className="px-4 text-light-primary-text dark:text-dark-primary-text">
              Hoặc
            </span>
            <div className="flex-grow border-t "></div>
          </div>
          <div className="flex justify-center mt-4 sm:mt-8">
            <GoogleButton />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
