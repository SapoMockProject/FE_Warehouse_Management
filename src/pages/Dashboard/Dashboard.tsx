import React from "react";
import "./Dashboard.css";
import InventoryOverTime from "./InventoryOverTime/InventoryOverTime";
import type { BaseResponse } from "../../types/BaseResponse";
import type { IStatisticResponse } from "../../types/IStatistic";
import { axiosConfiguration } from "../../configurations/AxiosConfiguration";
import CardComponent from "./Card/CardComponent";
import GoodReceiptOverProduct from "./GoodReceiptOverProduct/GoodReceiptOverProduct";

export const Dashboard = () => {
	const [data, setData] = React.useState<IStatisticResponse>({
		numberOfCategories: 0,
		numberOfEmployees: 0,
		numberOfProducts: 0,
		numberOfGoodsReceipts: 0,
		goodsReceiptItemCountMap: [],
		statisticOverTime: [],
	});
	React.useEffect(() => {
		const fetchData = async () => {
			const response = await axiosConfiguration.get("/statistics/statistic-over-time", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setData((response.data as BaseResponse<IStatisticResponse>).data);
		};
		fetchData();
	}, []);
	return (
		<div className="statistic_container">
			<div className="statistic_info_wrapper">
				<CardComponent
					label="Số lượng danh mục"
					value={data.numberOfCategories}
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="200"
							height="200"
							viewBox="0 0 24 24"
							className="statistic_avatar_small"
						>
							<path
								fill="#000000"
								fill-rule="evenodd"
								d="M4 4h5v5H4zm-2 7V2h9v9zm2 4h5v5H4zm-2 7v-9h9v9zM20 4h-5v5h5zm-7-2v9h9V2zm2 13h5v5h-5zm-2 7v-9h9v9z"
							/>
						</svg>
					}
				/>
				<CardComponent
					label="Số lượng nhân viên"
					value={data.numberOfEmployees}
					icon={
						<svg
							className="statistic_avatar_small"
							xmlns="http://www.w3.org/2000/svg"
							width="200"
							height="200"
							viewBox="0 0 1070 1000"
						>
							<path
								fill="#000000"
								d="M1070 938q0 21-2 63H1q0-10-.5-31T0 938q0-30 1-37q12-49 64-84.5t111.5-53t125.5-47t97-65.5q17-22 17-38q0-22-11-73q-4-21-10.5-36.5t-16-33T363 439q-15-35-33-132q-6-38-6-75q0-105 53.5-168T535 1t157.5 63T746 232q0 31-7 75q-14 89-32 132q-6 14-15.5 31.5t-16 33T665 540q-11 51-11 73q0 18 17 38q31 36 97 65.5t125 47t111 53t64 84.5q2 8 2 37z"
							/>
						</svg>
					}
				/>
				<CardComponent
					label="Số lượng sản phẩm"
					value={data.numberOfProducts}
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="200"
							height="200"
							viewBox="0 0 24 24"
							className="statistic_avatar_small"
						>
							<path
								fill="none"
								stroke="#000000"
								strokeLinejoin="round"
								strokeWidth="1.5"
								d="m12 12l8.073-4.625M12 12v9.25M12 12L7.963 9.688m12.11-2.313a3.17 3.17 0 0 0-1.165-1.156L16.25 4.696m3.823 2.679c.275.472.427 1.015.427 1.58v6.09a3.15 3.15 0 0 1-1.592 2.736l-5.316 3.046A3.2 3.2 0 0 1 12 21.25M3.926 7.375a3.14 3.14 0 0 0-.426 1.58v6.09c0 1.13.607 2.172 1.592 2.736l5.316 3.046A3.2 3.2 0 0 0 12 21.25M3.926 7.375a3.17 3.17 0 0 1 1.166-1.156l5.316-3.046a3.2 3.2 0 0 1 3.184 0l2.658 1.523M3.926 7.375l4.037 2.313m0 0l8.287-4.992"
							/>
						</svg>
					}
				/>
				<CardComponent
					label="Số lượng đơn nhập trong tháng"
					value={data.numberOfGoodsReceipts}
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="200"
							height="200"
							viewBox="0 0 24 24"
							className="statistic_avatar_small"
						>
							<path
								fill="none"
								stroke="#000000"
								strokeLinejoin="round"
								strokeWidth="1.5"
								d="m12 12l8.073-4.625M12 12v9.25M12 12L7.963 9.688m12.11-2.313a3.17 3.17 0 0 0-1.165-1.156L16.25 4.696m3.823 2.679c.275.472.427 1.015.427 1.58v6.09a3.15 3.15 0 0 1-1.592 2.736l-5.316 3.046A3.2 3.2 0 0 1 12 21.25M3.926 7.375a3.14 3.14 0 0 0-.426 1.58v6.09c0 1.13.607 2.172 1.592 2.736l5.316 3.046A3.2 3.2 0 0 0 12 21.25M3.926 7.375a3.17 3.17 0 0 1 1.166-1.156l5.316-3.046a3.2 3.2 0 0 1 3.184 0l2.658 1.523M3.926 7.375l4.037 2.313m0 0l8.287-4.992"
							/>
						</svg>
					}
				/>
			</div>
			<div className="statistic_chart_container">
				<div className="statistic_chart">
					<GoodReceiptOverProduct goodsReceiptItemCountMap={data.goodsReceiptItemCountMap} />
				</div>
				<div className="statistic_chart">
					<InventoryOverTime statisticOverTime={data.statisticOverTime} />
				</div>
			</div>
		</div>
	);
};
