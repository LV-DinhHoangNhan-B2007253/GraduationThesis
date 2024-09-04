import Link from "next/link";
import React from "react";

function NotFound() {
  return (
    <div className="w-full h-screen sm:bg-PageNotFound-img sm:bg-cover bg-none flex-col gap-3  bg-no-repeat flex justify-center items-center">
      <p className="sm:hidden block text-light-primary-text dark:text-dark-primary-text text-small sm:text-base">
        Page Not Found!
      </p>
      <Link
        href={"/"}
        className="block bg-light-btn-bg dark:bg-dark-bg-btn sm:p-4 p-3 rounded-md text-light-btn-text hover:bg-light-btn-hover hover:text-light-btn-bg-second"
      >
        Back Home
      </Link>
    </div>
  );
}

export default NotFound;
