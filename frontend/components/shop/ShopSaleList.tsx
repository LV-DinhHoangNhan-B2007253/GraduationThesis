"use client";

import { IPromotion } from "@/interfaces/promotion.interface";

function ShopSaleList({ promoList }: { promoList: IPromotion }) {
  return (
    <div>
      <div>{promoList.title}</div>
      <div>{}</div>
    </div>
  );
}

export default ShopSaleList;
