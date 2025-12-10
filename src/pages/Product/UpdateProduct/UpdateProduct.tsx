import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./UpdateProduct.css";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";

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
  category_name: string;
  option1name: string | null;
  option2name: string | null;
  option3name: string | null;
  variants: ProductVariant[];
  thumbnail: string;
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
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState("");
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const attributeOrder = ["Kích thước", "Màu sắc", "Chất liệu"];

  const [selected, setSelected] = useState<number[]>([]);

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSku, setNewSku] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/categories");
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
    axios
      .get(`http://localhost:8080/api/v1/products/${id}`)
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
    if (!product) return;

    const opts = getAllProductOptions(product);

    const newAttributes: Attribute[] = [];

    if (product.option1name) {
      newAttributes.push({
        name: product.option1name,
        values: (opts.option1 || []).filter(Boolean) as string[],
      });
    }

    if (product.option2name) {
      newAttributes.push({
        name: product.option2name,
        values: (opts.option2 || []).filter(Boolean) as string[],
      });
    }

    if (product.option3name) {
      newAttributes.push({
        name: product.option3name,
        values: (opts.option3 || []).filter(Boolean) as string[],
      });
    }

    setAttributes(newAttributes);
  }, [product]);

  /* ------------ ATTRIBUTES ------------ */
  const addAttribute = () => {
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
    if (files.length + newValidFiles.length > 9) {
      alert("Tối đa 9 ảnh.");
      return;
    }
    setFiles((prev) => [...prev, ...newValidFiles]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeThumbnail = () => {
    setProduct((prev) => {
      if (!prev) return prev; // hoặc return null
      return { ...prev, thumbnail: null };
    });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      for (const pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
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
  const openEditSkuModal = () => {
    if (selected.length === 0) {
      alert("Bạn phải chọn ít nhất 1 biến thể!");
      return;
    }
    setIsModalOpen(true);
  };
  const applyNewSku = () => {
    // TODO: Gọi API update SKU hàng loạt hoặc cập nhật state
    console.log("Áp dụng SKU:", newSku, "cho IDs:", selected);

    setIsModalOpen(false);
    setNewSku("");
  };

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
                value={product?.name}
                placeholder="Nhập tên sản phẩm"
                onChange={(v) => setName(v as string)}
              />
              <div className="add-product-hint">Tối đa 820 ký tự</div>
            </div>

            {/* DESCRIPTION */}
            <div className="update-product-field-row">
              <label className="update-product-label">Mô tả</label>
              <Input
                type="textarea"
                value={product?.description || ""}
                placeholder="Nhập mô tả"
                onChange={(v) => setDescription(v as string)}
              />
            </div>

            {/* ATTRIBUTES */}
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

            <h3>Danh sách biến thể</h3>
            <table className="variant-table">
              <thead>
                {selected.length > 0 ? (
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
                      <Button label="Sửa SKU" onClick={openEditSkuModal} />
                      {isModalOpen && (
                        <div className="update-variant-modal-overlay">
                          <div className="update-variant-modal-box">
                            <h3>Sửa SKU cho {selected.length} phiên bản</h3>

                            <input
                              type="text"
                              value={newSku}
                              onChange={(e) => setNewSku(e.target.value)}
                              placeholder="Nhập SKU mới"
                            />

                            <div className="modal-actions">
                              <button onClick={() => setIsModalOpen(false)}>
                                Hủy
                              </button>
                              <button onClick={applyNewSku}>Áp dụng</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </th>
                    <th>
                      <Button label="Sửa Giá" />
                    </th>
                    <th>
                      <Button label="Sửa số lượng" />
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
                      <td>{variantValue}</td>
                      <td>{e.sku}</td>
                      <td>{e.price}</td>
                      <td>{e.stock}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <Button
                label="Sửa sản phẩm"
                variant="primary"
                size="md"
                onClick={handleSave}
              />
              <Button label="Hủy" variant="secondary" size="md" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div className="update-product-card">
            <h2>Ảnh sản phẩm</h2>

            <div
              className="update-product-image-box"
              onClick={() => fileRef.current?.click()}
            >
              <div>
                <div style={{ fontSize: 18, marginBottom: 8 }}>
                  + Kéo thả hoặc thêm ảnh
                </div>
                <div className="update-product-muted">
                  Dung lượng tối đa 4MB, tối đa 9 ảnh
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
            <CustomSelect
              placeholder={
                categories
                  ? allCategories.find((c) => c.id.toString() === categories)
                      ?.name
                  : product?.category_name
              }
              value={categories}
              onChange={(value) => setCategories(value as string)}
            >
              {allCategories.map((cat) => (
                <SelectOption
                  key={cat.id}
                  value={cat.id.toString()}
                  label={cat.name}
                />
              ))}
            </CustomSelect>
          </div>
        </div>
      </div>
    </div>
  );
}
