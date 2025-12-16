import "./Pagination.css";
export interface IPaginationProps {
  page: number;
  totalPages: number;
  size: number;
  sortOrder: string;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onSortChange: (sortOrder: "asc" | "desc") => void;
}
export default function Pagination({
  page,
  totalPages,
  size,
  sortOrder,
  onPageChange,
  onSizeChange,
  onSortChange,
}: IPaginationProps) {
  return (
    <div className="pagination-container">
      <div className="pagination-controls">
        <button
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="pagination-btn"
        >
          Trước
        </button>

        <span className="pagination-info">
          Trang <strong>{page + 1}</strong> / {totalPages}
        </span>

        <button
          disabled={page === totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="pagination-btn"
        >
          Tiếp
        </button>
      </div>

      <div className="pagination-options">
        <label>
          {" "}
          <select
            value={size}
            onChange={(e) => {
              onSizeChange(parseInt(e.target.value));
              onPageChange(0);
            }}
            className="pagination-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>

        <label>
          Sắp xếp:{" "}
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as "asc" | "desc")}
            className="pagination-select"
          >
            <option value="asc">Cũ nhất</option>
            <option value="desc">Mới nhất</option>
          </select>
        </label>
      </div>
    </div>
  );
}
