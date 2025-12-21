import type { AxiosRequestConfig } from "axios";
import { axiosConfiguration } from "../../configurations/AxiosConfiguration";
import { toast } from "react-toastify";

export default function useExportExcel() {
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
	return { exportExcel };
}
