import type { AxiosRequestConfig } from "axios";
import React from "react";
import { toast } from "react-toastify";
import { axiosConfiguration } from "../../configurations/AxiosConfiguration";
import useModalComponent from "../../hooks/Modal/useModalComponent";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { CustomSelect } from "../Select/CustomSelect/CustomSelect";
import { SelectOption } from "../Select/SelectOption/SelectOption";
import "./ExportExcel.css";

export default function ExportExcelComponent({ config }: { config: AxiosRequestConfig }) {
	const [openModal, closeModal, ModalCompoent] = useModalComponent({ className: "export-excel-modal-container" });
	const [selectedFormat, setSelectedFormat] = React.useState<"csv" | "xlsx" | "xls">("xlsx");
	const [exportLimit, setExportLimit] = React.useState(1000);
	const handleExport = async() => {
		const exportExcel = async ({
			config,
			exportLimit,
			type,
		}: {
			config: AxiosRequestConfig;
			exportLimit: number;
			type: "csv" | "xlsx" | "xls";
		}) => {
			config.responseType = "blob";
			config.params["exportLimit"] = exportLimit;
			config.params["type"] = type.toUpperCase();
			const response = await axiosConfiguration(config);
			const fileName = response.headers["content-disposition"].split(";")[1].split("=")[1];
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("target", "_blank");
			link.setAttribute("download", fileName);
			link.click();
			window.URL.revokeObjectURL(url);
			toast.success("Xuất file thành công");
		};
		await exportExcel({ config, exportLimit, type: selectedFormat });
		closeModal();
	};
	return (
		<>
			<Button label="Xuất file" variant="secondary" size="md" onClick={openModal} />
			<ModalCompoent>
				<div className="export-excel-modal">
					<h2 className="export-excel-title">Xuất file sản phẩm</h2>
					<div className="export-excel-card">
						<p className="export-excel-description">Chọn định dạng file bạn muốn xuất:</p>
						<CustomSelect
							showSelectedInTrigger
							value={selectedFormat}
							onChange={(value) => setSelectedFormat(value.toString() as "csv" | "xlsx" | "xls")}
						>
							<SelectOption value="xlsx" label="Excel (.xlsx)" />
							<SelectOption value="csv" label="CSV (.csv)" />
							<SelectOption value="xls" label="XLS (.xls)" />
						</CustomSelect>
					</div>
					<div className="export-excel-card">
						<p className="export-excel-description">Số lượng sản phẩm bạn muốn xuất (Max là 100000):</p>
						<Input
							type="number"
							min={1}
							max={100000}
							value={exportLimit}
							onChange={(value) => {
								if ((value as number) <= 100000 && (value as number) >= 1) {
									setExportLimit(value as number);
								}
							}}
						/>
					</div>
					<div className="export-excel-actions">
						<Button label="Xuất file Excel" variant="secondary" size="md" onClick={handleExport} />
						<Button label="Huỷ" variant="primary" size="md" onClick={closeModal} />
					</div>
				</div>
			</ModalCompoent>
		</>
	);
}
