import React from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getAllGoodsReceipts } from "../../../apis/goodsReceiptApi";
import { deleteSupplier, getSupplierById } from "../../../apis/supplierApi";
import Button from "../../../components/Button/Button";
import DateField from "../../../components/DateField/DateField";
import PopConfirm from "../../../components/PopConfirm/PopConfirm";
import type { DateRange } from "../../../types/DateFieldProps";
import type { GoodsReceiptResponse } from "../../../types/IGoodsReceipt";
import type { ISupplierResponse } from "../../../types/ISupplier";
import { getSupplierStatusText, getSupplierStatusVariant } from "../../../utils/Supplier.util";
import TagComponent from "../Tag/TagComponent";
import UpdateSupplier from "../UpdateSupplier/UpdateSupplier";
import "./DetailSupplier.css";

export default function DetailSupplier() {
	const { id } = useParams<{ id: string }>();
	const [supplier, setSupplier] = React.useState<ISupplierResponse | null>(null);
	const [goodsReceipts, setGoodsReceipts] = React.useState<GoodsReceiptResponse[]>([]);
	const [filter, setFilter] = React.useState<DateRange>({ start: "", end: "", preset: "" });
	React.useEffect(() => {
		Promise.all([getSupplierById(Number(id)), getAllGoodsReceipts(0, 10, id, undefined, undefined, filter.start, filter.end)]).then(
			([supplierRes, goodsReceiptRes]) => {
				setSupplier(supplierRes.data);
				setGoodsReceipts(goodsReceiptRes.data.content);
			}
		);
	}, [id, filter]);
	const handleDeleteSupplier = async () => {
		try {
			await deleteSupplier((supplier as ISupplierResponse).id);
			navigate(-1);
		} catch (error) {
			console.error("Error deleting supplier:", error);
		}
	};
	const navigate = useNavigate();
	if (!id) {
		return <Navigate to="/suppliers" />;
	}
	return (
		<>
			<div className="supplier_detail_container">
				<div className="supplier_detail_header">
					<span className="supplier_detail_name">{supplier?.name}</span>
					<TagComponent
						message={getSupplierStatusText(supplier?.deleted as boolean)}
						variant={getSupplierStatusVariant(supplier?.deleted as boolean)}
					/>
				</div>
				<div className="supplier_detail_info_container">
					<div className="supplier_detail_info_wrapper">
						<div>
							<div className="supplier_detail_card">
								<div className="supplier_detail_statistic_header">
									<span className="supplier_detail_supplier_code">Mã nhà cung cấp: {supplier?.supplierCode}</span>
									<div>
										<DateField
											className="supplier_detail_date_range_picker"
											type="daterange"
											value={filter}
											onChange={(e) => {
												setFilter(e);
											}}
										/>
									</div>
								</div>
								<div className="supplier_detail_body">
									<div className="supplier_detail_info_block">
										<span>Đơn nhập đã tạo</span>
										<span>2 đơn</span>
										<span>{(20000000).toLocaleString("vi-VN")}đ</span>
									</div>
									<div className="supplier_detail_info_block">
										<span>Đơn nhập đã tạo</span>
										<span>2 đơn</span>
										<span>{(20000000).toLocaleString("vi-VN")}đ</span>
									</div>
									<div className="supplier_detail_info_block">
										<span>Đơn nhập đã tạo</span>
										<span>2 đơn</span>
										<span>{(20000000).toLocaleString("vi-VN")}đ</span>
									</div>
									<div className="supplier_detail_info_block">
										<span>Đơn nhập đã tạo</span>
										<span>2 đơn</span>
										<span>{(20000000).toLocaleString("vi-VN")}đ</span>
									</div>
								</div>
							</div>
							<div className="supplier_detail_card supplier_detail_history_container">
								<span className="supplier_detail_history_header_title">Lịch sử nhập trả hàng</span>
								{goodsReceipts.map((goodsReceipt, index) => (
									<div key={index}>
										<div className="supplier_detail_history_item_wrapper">
											<div className="supplier_detail_history_item_left_wrapper">
												<img src="/blue-shopping-cart-10910.png" />
												<div className="supplier_detail_history_item_left_info">
													<span style={{ fontSize: "1rem", fontWeight: 450 }}>
														Đơn nhập <Link to={"/"}>{goodsReceipt.goodsReceiptCode}</Link>
													</span>
													<span style={{ fontSize: "1rem", fontWeight: 450 }}>{goodsReceipt.createdDate}</span>
												</div>
											</div>
											<div className="supplier_detail_history_item_right_wrapper">
												<span className="supplier_detail_item_money">0đ</span>
												<div>
													<TagComponent style={{ marginRight: "20px" }} variant="default" message="Đã nhập" />
													<TagComponent variant="default" message="Đã thanh toán" />
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
						<div>
							<div className="supplier_detail_card supplier_detail_contact_container">
								<div className="supplier_detail_contact_header">
									<p>
										<div style={{ color: "#B5BABF" }}>Email:</div>
										<div>{supplier?.email}</div>
									</p>
									<p>
										<div style={{ color: "#B5BABF" }}>Điện thoại:</div> <div>{supplier?.phone}</div>
									</p>
									<p>
										<div style={{ color: "#B5BABF" }}>Địa chỉ:</div> <div>{supplier?.address}</div>
									</p>
									<p>
										<div style={{ color: "#B5BABF" }}>Tax:</div> <div>{supplier?.taxCode}</div>
									</p>
									<p>
										<div style={{ color: "#B5BABF" }}>Website:</div> <div>{supplier?.website}</div>
									</p>
									<div>
										<div style={{ color: "#B5BABF" }}>Ghi chú:</div> <div>{supplier?.note}</div>
									</div>
								</div>
								{supplier && (
									<div className="supplier_detail_update">
										<UpdateSupplier
											supplier={supplier}
											refreshData={(updatedSupplier) => setSupplier(updatedSupplier)}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="supplier_detail_footer">
						{supplier && (
							<PopConfirm
								title="Bạn có chắc muốn xoá?"
								description="Bạn có thể khôi khục trong mục Đã xoá?"
								actions={[
									{
										label: "Xóa",
										variant: "danger",
										onClick: handleDeleteSupplier,
									},
								]}
							>
								<Button label="Xóa" variant="danger" type="button" size="md" />
							</PopConfirm>
						)}
						<Button size="md" label="Huỷ" variant="tertiary" onClick={() => navigate(-1)} />
					</div>
				</div>
			</div>
		</>
	);
}
