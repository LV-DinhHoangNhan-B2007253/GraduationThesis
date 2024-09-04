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
    <section className="h-screen bg-light-bg  flex justify-center items-center   dark:bg-dark-bg    ">
      <div className=" shadow-md bg-light-modal-popup border border-light-element-border  sm:min-w-[600px] mx-3 py-20 container sm:mx-96 dark:bg-dark-modal-popup sm:px-5 rounded-md ">
        <div>
          <h1 className="text-base text-light-primary-text dark:text-dark-primary-text font-bold text-center sm:text-3xl py-2">
            Create an account
          </h1>
          <p className="text-small sm:text-base text-center text-light-primary-text dark:text-dark-primary-text  ">
            Already accout?
            <Link href={"/auth/login"} className=" underline font-bold mx-2">
              Login now{" "}
            </Link>
          </p>
        </div>
        <form onSubmit={HandleSubmit} className="px-4">
          <div className="my-3">
            <label
              htmlFor="email"
              className="block w-fit hover:cursor-pointer text-light-primary-text hover:font-bold   dark:text-dark-primary-text text-small sm:text-base py-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleOnchange}
              required={true}
              className="py-2 px-2 text-small sm:text-base w-full rounded dark:focus:border-dark-active focus:border-light-active border-light-input-border placeholder:text-light-input-placeholder text-light-input-text outline-none border  dark:bg-dark-input-field dark:border-dark-input-border dark:placeholder:text-dark-input-placeholder dark:text-dark-input-text"
              placeholder="your@gmail"
            />
          </div>
          <div className="my-3">
            <label
              htmlFor="name"
              className="block w-fit hover:cursor-pointer text-light-primary-text hover:font-bold   dark:text-dark-primary-text text-small sm:text-base py-1"
            >
              Your name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleOnchange}
              required={true}
              className="py-2 px-2 text-small sm:text-base w-full rounded dark:focus:border-dark-active focus:border-light-active border-light-input-border placeholder:text-light-input-placeholder text-light-input-text outline-none border  dark:bg-dark-input-field dark:border-dark-input-border dark:placeholder:text-dark-input-placeholder dark:text-dark-input-text"
            />
          </div>
          <div className="my-3">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block w-fit hover:cursor-pointer text-light-primary-text hover:font-bold   dark:text-dark-primary-text text-small sm:text-base py-1"
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
              className="py-2 px-2 text-small sm:text-base w-full rounded dark:focus:border-dark-active focus:border-light-active border-light-input-border placeholder:text-light-input-placeholder text-light-input-text outline-none border  dark:bg-dark-input-field dark:border-dark-input-border dark:placeholder:text-dark-input-placeholder dark:text-dark-input-text"
            />
          </div>

          <button
            type="submit"
            className="my-4 text-center w-full py-1 px-2 text-small sm:text-base tracking-widest border border-light-element-border bg-light-btn-bg hover:bg-light-btn-hover text-light-btn-text dark:border-dark-border hover:text-dark-primary-text dark:hover:text-light-primary-text dark:hover:bg-dark-bg-btn-hover transition-all "
          >
            Register
          </button>
        </form>
        <div className="flex items-center">
          <div className="flex-grow border-t border-light-card-border dark:border-dark-border"></div>
          <span className="px-4 text-light-primary-text dark:text-dark-primary-text">
            Or
          </span>
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
