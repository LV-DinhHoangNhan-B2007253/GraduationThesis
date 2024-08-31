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
    const data = await RegisterUser(formData);

    if (data?.accessToken) {
      // Lưu token vào local storage và chuyển hướng
      window.location.href = `http://localhost:3000/callback?access_token=${data.accessToken}`;
    }
  };

  const handleOnchange = (e: any) => {
    setFormData((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  return (
    <section className="h-screen  flex justify-center items-center bg-SignUp-light-bg bg-center dark:bg-SignUp-dark-bg object-cover  ">
      <div className="bg-white w- sm:w-[600px] mx-3 py-20 container sm:mx-96 dark:bg-bg-dark sm:px-5 rounded-[24px]">
        <div>
          <h1 className="text-base text-light-primary-text dark:text-dark-primary-text font-bold text-center sm:text-3xl py-2">
            Create an account
          </h1>
          <p className="text-small sm:text-base text-center text-light-primary-text dark:text-dark-primary-text">
            Already accout?
            <Link href={"/auth/login"} className=" underline font-bold mx-2">
              Login now{" "}
            </Link>
          </p>
        </div>
        <form onSubmit={HandleSubmit} className="px-4">
          <div className="py-1 px-2 my-2">
            <label
              htmlFor="email"
              className="block w-fit hover:cursor-pointer text-label-text hover:font-bold   dark:text-dark-primary-text text-small sm:text-base py-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleOnchange}
              required={true}
              className="py-2 px-2 text-small sm:text-base w-full rounded focus:border-input-focus  outline-none  focus:bg-transparent  border border-t-transparent  border-gray-200 "
              placeholder="your@gmail"
            />
          </div>
          <div className="py-1 px-2 my-1">
            <label
              htmlFor="name"
              className="block hover:cursor-pointer text-label-text hover:font-bold dark:text-dark-primary-text text-small sm:text-base py-1"
            >
              Your name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleOnchange}
              required={true}
              className="py-2 px-2 text-small sm:text-base w-full rounded focus:border-input-focus  outline-none  focus:bg-transparent  border border-t-transparent  border-gray-200 "
            />
          </div>
          <div className="py-1 px-2 my-1">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block hover:cursor-pointer text-label-text hover:font-bold dark:text-dark-primary-text text-small sm:text-base py-1"
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
              className="py-2 px-2 text-small sm:text-base w-full rounded focus:border-input-focus  outline-none  focus:bg-transparent  border border-t-transparent  border-gray-200 "
            />
          </div>

          <button
            type="submit"
            className="my-4 text-center w-full py-1 px-2 text-small sm:text-base tracking-widest border border-border-light dark:border-border-dark hover:text-dark-primary-text hover:bg-bg-dark dark:hover:text-light-primary-text dark:hover:bg-bg-light transition-all "
          >
            Register
          </button>
        </form>
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-4 text-light-primary-text dark:text-dark-primary-text">
            Or
          </span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <div className="flex justify-center mt-4">
          <GoogleButton />
        </div>
      </div>
    </section>
  );
}

export default Register;
