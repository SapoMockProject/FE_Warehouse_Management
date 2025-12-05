import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UpdateProduct() {
  const { id } = useParams(); // lấy id từ URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:8080/api/v1/product/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch((err) => console.error(err));
  }, [id]);
  console.log("Danh sách:", product);
  return (
    <div>
      <h1>Update Product: {id}</h1>
    </div>
  );
}
