"use client";

import { Spinner } from "@nextui-org/react";

function SpinnerLoader() {
  return (
    <div className="w-full flex justify-center items-center h-full">
      <Spinner />
    </div>
  );
}

export default SpinnerLoader;
