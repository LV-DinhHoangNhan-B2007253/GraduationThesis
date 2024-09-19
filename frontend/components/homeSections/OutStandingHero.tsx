"use client";
import Link from "next/link";

function OutStandingHero() {
  return (
    <Link
      href={"/product/outstanding"}
      className="sm:grid sm:grid-cols-2 h-full"
    >
      <div
        className={
          "bg-Hero2 h-full sm:col-span-1 bg-cover flex flex-col justify-between items-center py-10"
        }
      >
        <p className="text-white uppercase ">INTRODUCING 2024</p>
        <h1 className="text-white uppercase text-wrap text-6xl  text-center">
          LET EVERY SPACE OF YOUR HOME REFLECT THE THINGS YOU LOVE
        </h1>
        <button className="p-4 bg-white text-black uppercase text-center rounded scale-105 hover:scale-100 transition duration-200">
          Shop New Arrivals
        </button>
      </div>
      <div
        className={"bg-Hero1 h-full sm:col-span-1 bg-cover hidden sm:block"}
      ></div>
    </Link>
  );
}

export default OutStandingHero;
