import React from "react";
import SingleCardSekelecton from "./SingleCardSekelecton";

function ListCardSekelecton() {
  return (
    <div className="w-full grid grid-cols-6 gap-1">
      <div className="col-span-1">
        <SingleCardSekelecton />
      </div>
      <div className="col-span-1">
        <SingleCardSekelecton />
      </div>
      <div className="col-span-1">
        <SingleCardSekelecton />
      </div>
      <div className="col-span-1">
        <SingleCardSekelecton />
      </div>
      <div className="col-span-1">
        <SingleCardSekelecton />
      </div>
      <div className="col-span-1">
        <SingleCardSekelecton />
      </div>
    </div>
  );
}

export default ListCardSekelecton;
