"use client";
import { IOrderedProduct } from "@/interfaces/order.interface";
import OrderProductCard from "./OrderProductCard";

function ProdutOfOrderCard({
  orderProducts,
}: {
  orderProducts: IOrderedProduct[];
}) {
  return (
    <div>
      {orderProducts.map((product) => (
        <div>
          <OrderProductCard
            productId={product.product_id}
            qty={product.quantity}
            key={product.product_id}
            price={Number(product.price_at_purchase)}
          />
        </div>
      ))}
    </div>
  );
}

export default ProdutOfOrderCard;
