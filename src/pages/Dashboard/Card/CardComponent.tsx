import "./CardComponent.css";

export default function CardComponent({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
	return (
		<div className="statistic_card_wrapper">
			<div className="statistic_card_title_icon">
				<span className="statistic_card_label">{label}</span>
				{icon}
			</div>
			<div>
				<h2 className="statistic_card_value">{value}</h2>
			</div>
		</div>
	);
}
