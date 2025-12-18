import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { useRef } from "react";
import { Chart } from "react-chartjs-2";

ChartJS.register(LineController, LinearScale, CategoryScale, BarController, BarElement, PointElement, LineElement, Legend, Tooltip);

const options = {
	scales: {
		y: {
			beginAtZero: true,
		},
	},
};

export default function GoodReceiptOverProduct({ goodsReceiptItemCountMap }: { goodsReceiptItemCountMap: { first: number; second: number }[] }) {
	const labels = goodsReceiptItemCountMap.map((item) => item.first.toString());

	const data = {
		labels,
		datasets: [
			{
				type: "line" as const,
				label: "Số lượng đơn hàng nhập theo từng sản phẩm trong tháng này",
				borderColor: "rgb(255, 99, 132)",
				borderWidth: 2,
				fill: false,
				data: goodsReceiptItemCountMap.map((item) => item.second),
			},
		],
	};

	const chartRef = useRef<ChartJS>(null);

	return (
		<Chart
			ref={chartRef}
			type="bar"
			options={{
				...options,
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1
			}}
			data={data}
		/>
	);
}
