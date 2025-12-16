import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import { Role } from "../../../types/IUser.d";
import "./UpdateProduct.css";
import { updateProduct } from "../../../apis/productApi";

interface Attribute {
  name: string;
  values: string[];
}

interface Category {
  id: number;
  name: string;
}

interface ProductResponse {
  id: number;
  name: string;
  description: string;
  categoryName: string;
  option1name: string | null;
  option2name: string | null;
  option3name: string | null;
  variants: ProductVariant[];
  thumbnail: string | null;
}

interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  imageUrl: string;
  option1value: string | null;
  option2value: string | null;
  option3value: string | null;
}

export default function UpdateProduct() {
  const { id } = useParams(); // lấy id từ URL
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const fileRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const [variantImages, setVariantImages] = useState<{ [key: number]: string }>(
    {}
  );
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState("");
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const attributeOrder = ["Kích thước", "Màu sắc", "Chất liệu"];

  const [selected, setSelected] = useState<number[]>([]);
  const selectedArray = Array.isArray(selected) ? selected : [selected];
  const navigate = useNavigate();
  const [isModalOpenSKU, setIsModalOpenSKU] = useState(false);
  const [newSku, setNewSku] = useState<{ [key: number]: string }>({});
  const [isModalOpenPrice, setIsModalOpenPrice] = useState(false);
  const [newPrice, setNewPrice] = useState<{ [key: number]: string }>({});
  const [isModalOpenStock, setIsModalOpenStock] = useState(false);
  const [newStock, setNewStock] = useState<{ [key: number]: string }>({});
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/v1/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(res.data.data.content);
        setAllCategories(res.data.data.content);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8080/api/v1/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => setProduct(res.data.data))
      .catch((err) => console.error(err));
  }, [id]);

  const getVariantName = (
    product: ProductResponse,
    variant: ProductVariant
  ): string => {
    const options: string[] = [];

    if (product.option1name && variant.option1value) {
      options.push(variant.option1value);
    }
    if (product.option2name && variant.option2value) {
      options.push(variant.option2value);
    }
    if (product.option3name && variant.option3value) {
      options.push(variant.option3value);
    }

    return options.join(" / ");
  };

  const getAllProductOptions = (product: ProductResponse) => {
    if (!product.variants) return {};

    const option1 = Array.from(
      new Set(product.variants.map((v) => v.option1value).filter(Boolean))
    );

    const option2 = Array.from(
      new Set(product.variants.map((v) => v.option2value).filter(Boolean))
    );

    const option3 = Array.from(
      new Set(product.variants.map((v) => v.option3value).filter(Boolean))
    );

    return {
      option1,
      option2,
      option3,
    };
  };

  useEffect(() => {
    const load = () => {
      if (!product) return;

      const opts = getAllProductOptions(product);

      const newAttributes: Attribute[] = [];

      if (product.option1name) {
        newAttributes.push({
          name: product.option1name,
          values: (opts.option1 || []) as string[],
        });
      }

      if (product.option2name) {
        newAttributes.push({
          name: product.option2name,
          values: (opts.option2 || []) as string[],
        });
      }

      if (product.option3name) {
        newAttributes.push({
          name: product.option3name,
          values: (opts.option3 || []) as string[],
        });
      }
      setAttributes(newAttributes);
      setName(product.name);
      setDescription(product.description);
    };
    load();
  }, [product]);

  /* ------------ ATTRIBUTES ------------ */
  const addAttribute = () => {
    console.log(attributes);

    setAttributes((prev) => {
      if (prev.length >= 3) return prev;
      const nextName = attributeOrder[prev.length];
      return [...prev, { name: nextName, values: [] }];
    });
  };

  const removeAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAttributeName = (index: number, value: string) => {
    setAttributes((prev) =>
      prev.map((attr, i) => (i === index ? { ...attr, name: value } : attr))
    );
  };

  const addAttributeValue = (index: number, value: string) => {
    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === index ? { ...attr, values: [...attr.values, value] } : attr
      )
    );
  };

  const removeAttributeValue = (aIndex: number, vIndex: number) => {
    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === aIndex
          ? { ...attr, values: attr.values.filter((_, j) => j !== vIndex) }
          : attr
      )
    );
  };

  /* ------------ FILE HANDLING ------------ */
  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles);
    const newValidFiles = arr.filter(
      (f) => f.type.startsWith("image/") && f.size <= 4 * 1024 * 1024
    );
    if (files.length + newValidFiles.length > 1) {
      alert("Tối đa 1 ảnh.");
      return;
    }
    setFiles((prev) => [...prev, ...newValidFiles]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeThumbnail = () => {
    setProduct((prev) => {
      if (!prev) return prev;
      return { ...prev, thumbnail: null };
    });
  };

  const handleSave = async () => {
    console.log("ID: ", id);
    console.log("Name: ", name);
    console.log("Description: ", description);
    console.log("CategoryID: ", categories);
    console.log("Ảnh: ", files);
    // console.log("IMG", variantImages);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", categories);
      formData.append("description", description);
      formData.append("imageUrl", files[0]);
      console.log("---Data---", formData);
      await updateProduct(Number(id), formData);
      navigate("/products");
    } catch (err) {
      console.log(err);
    }
  };
  //

  const toggleSelect = (id: number) => {
    setSelected(
      (prev) =>
        prev.includes(id)
          ? prev.filter((x) => x !== id) // bỏ chọn
          : [...prev, id] // chọn
    );
  };

  const toggleSelectAll = () => {
    if (!product?.variants) return;

    if (selected.length === product.variants.length) {
      setSelected([]); // bỏ chọn hết
    } else {
      setSelected(product.variants.map((v) => v.id)); // chọn tất cả
    }
  };

  //Mở modal
  const applyNewSku = async () => {
    if (!newSku) return;

    const updateList = Object.entries(newSku).map(([id, sku]) => ({
      id: Number(id),
      sku,
    }));

    // console.log("-----", updates);
    console.log("-----2----", newSku);
    console.log("----3----", updateList);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8080/api/v1/product-variant/update-skus",
        updateList,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update SKU thành công:", res.data);

      setProduct((prev) => {
        if (!prev) return prev;

        const updatedVariants = prev.variants.map((v) => {
          const updated = updateList.find((u) => u.id === v.id);
          return updated ? { ...v, sku: updated.sku } : v;
        });

        return { ...prev, variants: updatedVariants };
      });
    } catch (error) {
      console.error("Lỗi update SKU:", error);
    }

    setIsModalOpenSKU(false);
    setNewSku("");
  };

  const applyNewPrice = async () => {
    if (!newPrice) return;

    const updateList = Object.entries(newPrice).map(([id, price]) => ({
      id: Number(id),
      price: Number(price),
    }));

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8080/api/v1/product-variant/update-prices",
        updateList,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update price thành công:", res.data);

      setProduct((prev) => {
        if (!prev) return prev;

        const updatedVariants = prev.variants.map((v) => {
          const updated = updateList.find((u) => u.id === v.id);
          return updated ? { ...v, price: updated.price } : v;
        });

        return { ...prev, variants: updatedVariants };
      });
    } catch (error) {
      console.error("Lỗi update Price:", error);
    }
    setIsModalOpenPrice(false);
    setNewPrice({});
  };

  const applyNewStock = async () => {
    if (!newStock) return;

    const updateList = Object.entries(newStock).map(([id, stock]) => ({
      id: Number(id),
      stock: Number(stock),
    }));

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8080/api/v1/product-variant/update-stocks",
        updateList,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update stock thành công:", res.data);

      setProduct((prev) => {
        if (!prev) return prev;

        const updatedVariants = prev.variants.map((v) => {
          const updated = updateList.find((u) => u.id === v.id);
          return updated ? { ...v, stock: updated.stock } : v;
        });

        return { ...prev, variants: updatedVariants };
      });
    } catch (err) {
      console.log("Lỗi update Stock", err);
    }

    setIsModalOpenStock(false);
    setNewStock({});
  };

  const applyNewPriceAll = async () => {
    if (!price || selectedArray.length === 0) return;

    const payload = {
      variantIds: selectedArray,
      price: Number(price),
    };
    console.log("---------10---------", payload);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:8080/api/v1/product-variant/update-all-prices",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProduct((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          variants: prev.variants.map((v) =>
            selectedArray.includes(v.id) ? { ...v, price: Number(price) } : v
          ),
        };
      });
    } catch (err) {
      console.log("Lỗi update price", err);
    }
    setIsModalOpenPrice(false);
  };

  const applyStockAll = async () => {
    if (!stock || selectedArray.length === 0) return;
    const loadStock = {
      variantIds: selectedArray,
      stock: stock,
    };
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8080/api/v1/product-variant/update-all-stocks",
        loadStock,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProduct((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          variants: prev.variants.map((v) =>
            selectedArray.includes(v.id) ? { ...v, stock: Number(stock) } : v
          ),
        };
      });
    } catch (err) {
      console.log(err);
    }
    setIsModalOpenStock(false);
  };

  const handleVariantImageChange = async (
    id: number,
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = ev.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setVariantImages((prev) => ({ ...prev, [id]: previewUrl }));

    const formData = new FormData();
    formData.append("imageUrl", file);
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `http://localhost:8080/api/v1/product-variant/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Image uploaded for variant:", id, res.data);
  };

  const user = React.useContext(AuthenticationContext);
  return (
    <div className="update-product-container">
      <h1 className="update-product-title">Chi tiết sản phẩm</h1>
      <div className="update-product-grid">
        {/* Left column */}
        <div>
          <div className="update-product-card">
            <h2>Thông tin sản phẩm</h2>

            {/* NAME */}
            <div className="update-product-field-row">
              <label className="update-product-label">Tên sản phẩm</label>
              <Input
                type="text"
                value={name}
                placeholder="Nhập tên sản phẩm"
                onChange={(value) => setName(value.toString())}
                readonly={user?.user.role === "COORDINATOR"}
              />
              <div className="add-product-hint">Tối đa 820 ký tự</div>
            </div>

            {/* DESCRIPTION */}
            <div className="update-product-field-row">
              <label className="update-product-label">Mô tả</label>
              <Input
                type="textarea"
                value={description}
                placeholder="Nhập mô tả"
                onChange={(value) => setDescription(value.toString())}
                readonly={user?.user.role === "COORDINATOR"}
              />
            </div>

            {/* ATTRIBUTES */}
            {user?.user.role !== "COORDINATOR" && (
              <div
                className="update-product-card add-product-attributes"
                style={{ padding: "12px" }}
              >
                <div className="update-product-attr-header">
                  <strong>Thuộc tính</strong>

                  {attributes.length < 3 && (
                    <Button
                      label="+ Thêm thuộc tính"
                      variant="secondary"
                      size="sm"
                      onClick={addAttribute}
                    />
                  )}
                </div>

                <div className="update-product-attr-table">
                  {attributes.length > 0 && (
                    <div
                      className="update-product-attr-row"
                      style={{
                        fontWeight: "bold",
                        marginBottom: 6,
                        borderBottom: "1px solid #f3f6fa",
                        fontSize: 14,
                      }}
                    >
                      <div style={{ flex: "0 0 220px" }}>Tên thuộc tính</div>
                      <div style={{ flex: 1 }}>Giá trị</div>
                      <div style={{ flex: "0 0 48px" }}></div>
                    </div>
                  )}

                  {attributes.map((attr, aIndex) => (
                    <div className="update-product-attr-row" key={aIndex}>
                      {/* Attribute name */}
                      <div style={{ flex: "0 0 220px" }}>
                        <Input
                          type="text"
                          value={attr.name}
                          placeholder="Kích thước, Màu sắc…"
                          onChange={(v) =>
                            updateAttributeName(aIndex, v as string)
                          }
                        />
                      </div>

                      {/* Tag input */}
                      <div style={{ flex: 1 }}>
                        <div className="update-product-tag-input-wrapper">
                          {attr.values.map((val, vIndex) => (
                            <span className="update-product-tag" key={vIndex}>
                              {val}
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  removeAttributeValue(aIndex, vIndex)
                                }
                              >
                                ×
                              </span>
                            </span>
                          ))}

                          <Input
                            type="text"
                            className="update-product-tag-input"
                            placeholder="Nhập và Enter"
                            onChange={() => {}}
                            onKeyDown={(
                              e: React.KeyboardEvent<HTMLInputElement>
                            ) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const val = e.currentTarget.value.trim();
                                if (val) {
                                  addAttributeValue(aIndex, val);
                                  e.currentTarget.value = "";
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ flex: "0 0 48px" }}>
                        <Button
                          label="Xóa"
                          variant="danger"
                          size="sm"
                          onClick={() => removeAttribute(aIndex)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3>Danh sách biến thể</h3>
            <table className="variant-table">
              <thead>
                {selected.length > 0 && user?.user.role !== Role.COORDINATOR ? (
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selected.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>Đã chọn {selected.length} phiên bản</th>
                    <th>
                      <Button
                        label="Sửa SKU"
                        onClick={() => setIsModalOpenSKU(true)}
                      />
                      {isModalOpenSKU && (
                        <div className="update-variant-sku-modal-overlay">
                          <div className="update-variant-sku-modal-box">
                            <h3>Chỉnh sửa SKU</h3>

                            {product?.variants
                              .filter((e) => selectedArray.includes(e.id))
                              .map((e) => (
                                <div className="update-variant-sku" key={e.id}>
                                  <div className="variant-sku-lable">
                                    <label>
                                      {[
                                        e.option1value,
                                        e.option2value,
                                        e.option3value,
                                      ]
                                        .filter(Boolean)
                                        .join(" / ")}
                                    </label>
                                  </div>

                                  <div className="variant-sku-input">
                                    <Input
                                      value={newSku[e.id]}
                                      placeholder={e.sku}
                                      type="text"
                                      onChange={(value) =>
                                        setNewSku((prev) => ({
                                          ...prev,
                                          [e.id]: value.toString(),
                                        }))
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            <div className="update-product-modal-actions">
                              <Button
                                label="Hủy"
                                size="md"
                                onClick={() => setIsModalOpenSKU(false)}
                              />

                              <Button
                                label="Áp dụng"
                                variant="secondary"
                                size="md"
                                onClick={applyNewSku}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </th>
                    <th>
                      <Button
                        label="Sửa Giá"
                        onClick={() => setIsModalOpenPrice(true)}
                      />
                      {isModalOpenPrice && (
                        <div className="update-variant-price-modal-overlay">
                          <div className="update-variant-price-modal-box">
                            <h3>Chỉnh sửa giá</h3>
                            <div className="update-all-variant-price">
                              <div className="variant-price-left">
                                <p>Áp dụng một giá cho tất cả các phiên bản</p>
                                <Input
                                  type="text"
                                  value={price}
                                  onChange={(value) => setPrice(Number(value))}
                                />
                              </div>
                              <div className="variant-price-right">
                                <Button
                                  label="Áp dụng cho tất cả"
                                  variant="tertiary"
                                  size="lg"
                                  onClick={applyNewPriceAll}
                                />
                              </div>
                            </div>
                            {product?.variants
                              .filter((e) => selectedArray.includes(e.id))
                              .map((e) => (
                                <div
                                  className="update-variant-price"
                                  key={e.id}
                                >
                                  <div className="variant-price-lable">
                                    <label>
                                      {[
                                        e.option1value,
                                        e.option2value,
                                        e.option3value,
                                      ]
                                        .filter(Boolean)
                                        .join(" / ")}
                                    </label>
                                  </div>
                                  <div className="variant-price-input">
                                    <Input
                                      type="text"
                                      value={newPrice[0]}
                                      placeholder={e.price.toString()}
                                      onChange={(value) =>
                                        setNewPrice((prev) => ({
                                          ...prev,
                                          [e.id]: value.toString(),
                                        }))
                                      }
                                    />
                                  </div>
                                </div>
                              ))}

                            <div className="update-product-modal-actions">
                              <Button
                                label="Hủy"
                                size="md"
                                onClick={() => setIsModalOpenPrice(false)}
                              />

                              <Button
                                label="Áp dụng"
                                variant="secondary"
                                size="md"
                                onClick={applyNewPrice}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </th>
                    <th>
                      <Button
                        label="Sửa số lượng"
                        onClick={() => setIsModalOpenStock(true)}
                      />
                      {isModalOpenStock && (
                        <div className="update-variant-stock-modal-overlay">
                          <div className="update-variant-stock-modal-box">
                            <h3>Chỉnh sửa số lượng</h3>
                            <div className="update-all-variant-stock">
                              <div className="variant-stock-left">
                                <p>
                                  Áp dụng một số lượng cho tất cả các phiên bản
                                </p>
                                <Input
                                  type="text"
                                  value={stock}
                                  onChange={(value) => setStock(Number(value))}
                                />
                              </div>
                              <div className="variant-stock-right">
                                <Button
                                  label="Áp dụng cho tất cả"
                                  variant="tertiary"
                                  size="lg"
                                  onClick={applyStockAll}
                                />
                              </div>
                            </div>
                            {product?.variants
                              .filter((e) => selectedArray.includes(e.id))
                              .map((e) => (
                                <div
                                  className="update-variant-stock"
                                  key={e.id}
                                >
                                  <div className="variant-stock-lable">
                                    <label>
                                      {[
                                        e.option1value,
                                        e.option2value,
                                        e.option3value,
                                      ]
                                        .filter(Boolean)
                                        .join(" / ")}
                                    </label>
                                  </div>
                                  <div className="variant-stock-input">
                                    <Input
                                      type="number"
                                      value={newStock[e.stock]}
                                      onChange={(value) =>
                                        setNewStock((prev) => ({
                                          ...prev,
                                          [e.id]: value.toString(),
                                        }))
                                      }
                                      placeholder={e.stock.toString()}
                                    />
                                  </div>
                                </div>
                              ))}

                            <div className="update-product-modal-actions">
                              <Button
                                label="Hủy"
                                size="md"
                                onClick={() => setIsModalOpenStock(false)}
                              />

                              <Button
                                label="Áp dụng"
                                variant="secondary"
                                size="md"
                                onClick={applyNewStock}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </th>
                  </tr>
                ) : (
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selected.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>Biến thể</th>
                    <th>SKU</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                  </tr>
                )}
              </thead>

              <tbody>
                {product?.variants.map((e) => {
                  const variantValue = getVariantName(product, e);

                  return (
                    <tr key={e.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(e.id)}
                          onChange={() => toggleSelect(e.id)}
                        />
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <img
                            src={variantImages[e.id] || e.imageUrl}
                            alt="Lỗi ảnh"
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onClick={() => fileRefs.current[e.id]?.click()}
                          />

                          <input
                            ref={(el) => {
                              fileRefs.current[e.id] = el;
                            }}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(ev) =>
                              handleVariantImageChange(e.id, ev)
                            }
                          />
                        </div>

                        {variantValue}
                      </td>
                      <td>{e.sku}</td>
                      <td>{e.price}</td>
                      <td>{e.stock}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {user?.user.role !== Role.COORDINATOR && (
              <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                <Button
                  label="Sửa sản phẩm"
                  variant="primary"
                  size="md"
                  onClick={handleSave}
                />
                <Button label="Hủy" variant="secondary" size="md" />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div className="update-product-card">
            <h2>Ảnh sản phẩm</h2>

            {user?.user.role !== Role.COORDINATOR && (
              <div
                className="update-product-image-box"
                onClick={() => fileRef.current?.click()}
              >
                <div>
                  <div style={{ fontSize: 18, marginBottom: 8 }}>
                    + Kéo thả hoặc thêm ảnh
                  </div>
                  <div className="update-product-muted">
                    Dung lượng tối đa 4MB, tối đa 1 ảnh
                  </div>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
            )}

            {/* PREVIEW */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))",
                gap: 10,
                marginTop: 14,
              }}
            >
              {/* ẢNH THUMBNAIL TỪ API */}
              {product?.thumbnail && (
                <div
                  style={{
                    position: "relative",
                    border: "1px solid #e6e9ee",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={product.thumbnail}
                    style={{
                      width: "100%",
                      height: 90,
                      objectFit: "cover",
                    }}
                  />

                  {/* nút xóa thumbnail */}
                  {user?.user.role !== Role.COORDINATOR && (
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              )}

              {/* ẢNH MỚI TỪ FILES */}
              {files.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    border: "1px solid #e6e9ee",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    style={{
                      width: "100%",
                      height: 90,
                      objectFit: "cover",
                    }}
                  />

                  {/* nút xóa ảnh mới */}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="update-product-helper-row">
              <div className="update-product-small add-product-muted">
                Kéo thả ảnh hoặc nhấn để chọn
              </div>
              <div className="update-product-small add-product-muted">
                {files.length} ảnh
              </div>
            </div>
          </div>

          {/* CATEGORY SELECT */}
          <div className="update-product-card" style={{ marginTop: 20 }}>
            <h2>Danh mục</h2>
            {user?.user.role !== Role.COORDINATOR ? (
              <CustomSelect
                placeholder={
                  categories
                    ? allCategories.find((c) => c.id.toString() === categories)
                        ?.name
                    : product?.categoryName
                }
                value={categories}
                onChange={(value) => setCategories(value as string)}
                showSelectedInTrigger={true}
              >
                {allCategories.map((cat) => (
                  <SelectOption
                    key={cat.id}
                    value={cat.id.toString()}
                    label={cat.name}
                  />
                ))}
              </CustomSelect>
            ) : (
              <Input value={product?.categoryName} readonly type="text" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
