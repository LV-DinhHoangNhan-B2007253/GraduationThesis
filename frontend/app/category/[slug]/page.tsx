import React from "react";

function ProductsByCategory(props: any) {
  const categoryId = props.params.slug;
  return <div>{categoryId}</div>;
}

export default ProductsByCategory;
