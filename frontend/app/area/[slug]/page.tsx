"use client";

function ProductsByArea(props: any) {
  const areaId = props.params.slug;
  return <div>{areaId}</div>;
}

export default ProductsByArea;
