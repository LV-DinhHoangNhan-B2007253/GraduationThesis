"use client";
import React, { Suspense, useEffect, useState } from "react";
import Spinner from "../Spinner";

function ProductManagement() {
  const [a, setA] = useState<boolean>(false);
  useEffect(() => {
    setA(false);
    const test = setTimeout(() => {
      console.log("product management mounted!");
      setA(true);
    }, 3000);

    return () => {
      clearTimeout(test);
    };
  }, []);
  return <div>{a ? <div>ProductManagement</div> : <Spinner />}</div>;
}

export default ProductManagement;
