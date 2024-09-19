"use client";

import { IArea } from "@/interfaces/area.interface";
import Link from "next/link";

function AreaHomeCard({ areaItem }: { areaItem: IArea }) {
  return (
    <div className="px-3 w-full ">
      <div className="h-4/5">
        <img
          src={`${areaItem.banner}`}
          alt="banner"
          className=" object-cover h-full rounded-t-sm hover:cursor-pointer hover:brightness-90 transition duration-200"
        />
      </div>
      <div className="h-1/5 flex flex-col justify-between">
        <h1 className="uppercase text-2xl text-light-primary-text dark:text-dark-primary-text tracking-widest py-2">
          {areaItem.name}
        </h1>
        <Link
          href={`/area/${areaItem._id}`}
          className="block px-4 text-center uppercase text-small  py-2  border border-light-card-border translate-y-0 hover:-translate-y-0.5 hover:scale-105 transition duration-400 hover:border-2 hover:rounded-md hover:bg-black hover:text-white"
        >
          explore now
        </Link>
      </div>
    </div>
  );
}

export default AreaHomeCard;
