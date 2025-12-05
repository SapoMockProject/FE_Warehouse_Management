import React, { useState, useRef, useEffect } from "react";
import "./CreateProduct.css";
import axios from "axios";
import Button from "../../../components/Button/Button";

interface Attribute {
  name: string;
  values: string[];
}

interface Product {
  name: string;
  sku: string;
  price: number | string;
  stock: number | string;
  description: string;
  attributes: Attribute[];
  categories: string;
  images: File[];
}

interface Category {
  id: number;
  name: string;
}

const AddProductForm: React.FC = () => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [desc, setDesc] = useState("");
  const [attributes, setAttributes] = useState<Attribute[]>([
    // { name: "Kích thước", values: [] },
    // { name: "Màu sắc", values: [] },
  ]);
  const attributeOrder = ["Kích thước", "Màu sắc", "Chất liệu"];

  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState("");
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/category/get_all"
        );

        setAllCategories(res.data.data); // LẤY ĐÚNG MẢNG
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const resProduct = await axios.post<Product[]>(
  //         "http://localhost:8080/api/v1/product"
  //       );
  //     } catch (err) {
  //       console.error("Lỗi product: ", err);
  //     }
  //   };
  //   fetchProduct();
  // });

  /* ---------------- File handling ---------------- */
  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles);
    const newValidFiles = arr.filter(
      (f) => f.type.startsWith("image/") && f.size <= 4 * 1024 * 1024
    );
    if (files.length + newValidFiles.length > 9) {
      alert("Chỉ được chọn tối đa 9 ảnh.");
      return;
    }
    setFiles((prev) => [...prev, ...newValidFiles]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ---------------- Attribute handling ---------------- */
  const addAttribute = () => {
    setAttributes((prev) => {
      if (prev.length >= 3) return prev; // Đã đủ 3 -> không thêm nữa

      const nextName = attributeOrder[prev.length]; // Lấy tên theo thứ tự
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
        i === index
          ? {
              ...attr,
              values: [...attr.values, value],
            }
          : attr
      )
    );
  };

  const removeAttributeValue = (aIndex: number, vIndex: number) => {
    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === aIndex
          ? {
              ...attr,
              values: attr.values.filter((_, j) => j !== vIndex),
            }
          : attr
      )
    );
  };

  /* ---------------- Form actions ---------------- */

  function generateCombinations(attributes: Attribute[]) {
    const values = attributes.map((attr) => attr.values);

    const combine = (arr: string[][], prefix: string[] = []): string[][] => {
      if (!arr.length) return [prefix];
      const [first, ...rest] = arr;
      return first.flatMap((value) => combine(rest, [...prefix, value]));
    };

    const raw = combine(values);

    return raw.map((combination) => {
      const obj: any = {};
      attributes.forEach((attr, index) => {
        obj[attr.name] = combination[index];
      });
      return obj;
    });
  }
  const combos = generateCombinations(attributes);
  // console.log(combos);

  const buildVariants = () => {
    return combos.map((combo) => ({
      sku: sku,
      price: price,
      stock: stock,
      option1value: combo[attributes[0]?.name] || "",
      option2value: combo[attributes[1]?.name] || "",
      option3value: combo[attributes[2]?.name] || "",
      imageUrl: files[0].name,
    }));
  };

  const handleSave = async () => {
    try {
      const variants = buildVariants();

      // Gửi JSON, KHÔNG gửi FormData
      const payload = {
        name,
        description: desc,
        categoryId: categories,
        option1name: attributes[0]?.name || "",
        option2name: attributes[1]?.name || "",
        option3name: attributes[2]?.name || "",
        variants,
        // Nếu backend chưa hỗ trợ upload ảnh, gửi tạm file name hoặc bỏ qua
        imageUrls: files.map((f) => f.name),
      };

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8080/api/v1/product",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Tạo sản phẩm thành công!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo sản phẩm!");
    }
  };

  const handleReset = () => {
    if (!window.confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu?")) return;
    setName("");
    setSku("");
    setPrice("");
    setStock("");
    setDesc("");
    setFiles([]);
    setCategories("");
    setAttributes([
      { name: "Kích thước", values: [] },
      { name: "Màu sắc", values: [] },
    ]);
  };

  /* ---------------- JSX ---------------- */
  return (
    <div className="addProduct-container">
      <h1 className="page-title">Thêm sản phẩm</h1>

      <div className="grid">
        {/* LEFT COLUMN */}
        <div>
          <div className="card">
            <h2>Thông tin sản phẩm</h2>

            <div className="field-row">
              <label htmlFor="name">Tên sản phẩm</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Mô tả sản phẩm"
              />
              <div className="hint">Nhập tên sản phẩm (tối đa 820 ký tự)</div>
            </div>

            <div className="row">
              <div className="col-2">
                <label htmlFor="sku">Mã SKU</label>
                <input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  type="text"
                  placeholder="Nhập SKU"
                />
              </div>
              <div className="col-2">
                <label htmlFor="barcode">Số lượng</label>
                <input
                  id="barcode"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  placeholder="Nhập số lượng"
                />
              </div>
            </div>

            <div className="field-row">
              <label htmlFor="unit">Giá</label>
              <input
                id="unit"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                type="text"
                placeholder="Nhập giá"
              />
            </div>

            <div className="field-row">
              <label htmlFor="desc">Mô tả</label>
              <textarea
                id="desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
            </div>

            {/* ATTRIBUTES */}
            <div className="card attributes" style={{ padding: "12px" }}>
              <div className="attr-header">
                <strong>Thuộc tính</strong>
                {attributes.length < 3 && (
                  <button className="btn btn-ghost" onClick={addAttribute}>
                    + Thêm thuộc tính
                  </button>
                )}
              </div>

              <div className="attr-table">
                {attributes.length > 0 && (
                  <div
                    className="attr-row"
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
                  <div className="attr-row" key={aIndex}>
                    <div style={{ flex: "0 0 220px" }}>
                      <input
                        type="text"
                        placeholder="Kích thước, Màu sắc..."
                        value={attr.name}
                        onChange={(e) =>
                          updateAttributeName(aIndex, e.target.value)
                        }
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div className="tag-input-wrapper">
                        {attr.values.map((val, vIndex) => (
                          <span className="tag" key={vIndex}>
                            {val}
                            <button
                              type="button"
                              onClick={() =>
                                removeAttributeValue(aIndex, vIndex)
                              }
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <input
                          className="tag-input"
                          type="text"
                          placeholder="Nhập và ấn Enter"
                          onKeyDown={(e) => {
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
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => removeAttribute(aIndex)}
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/*  */}
            <div>
              <h3>Danh sách biến thể</h3>

              <table>
                <thead>
                  <tr>
                    <th></th>
                    {attributes.map((attr) => (
                      <th key={attr.name}>{attr.name}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {combos.map((combo, index) => (
                    <tr key={index}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      {attributes.map((attr) => (
                        <td key={attr.name}>{combo[attr.name]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/*  */}
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              {/* <button className="btn btn-primary" onClick={handleSave}>
                Lưu
              </button> */}
              <Button
                label="Tạo sản phẩm"
                variant="primary"
                type="submit"
                size="md"
                onClick={handleSave}
              />
              <button className="btn btn-ghost" onClick={handleReset}>
                Hủy
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div className="card">
            <h2>Ảnh sản phẩm</h2>
            <div
              id="dropZone"
              ref={dropRef}
              className="image-box"
              onClick={() => fileRef.current?.click()}
            >
              <div>
                <div style={{ fontSize: 18, marginBottom: 8 }}>
                  + Kéo thả hoặc thêm ảnh
                </div>
                <div className="muted">Dung lượng tối đa 4MB, tối đa 9 ảnh</div>
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

            <div
              id="previewList"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))",
                gap: 10,
                marginTop: 14,
              }}
            >
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
                    alt="preview"
                    style={{
                      width: "100%",
                      height: 90,
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    title="Xóa ảnh"
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

            <div className="helper-row">
              <div className="small muted">Kéo thả ảnh hoặc nhấn để chọn</div>
              <div id="imgCount" className="small muted">
                {files.length} ảnh
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <h2>Danh mục</h2>
            <select
              className="select-category"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            >
              <option value="">Chọn danh mục</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
