import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFoundPage() {
    const navigate = useNavigate();
	return (
		<>
			<div className="not_found_container">
				<img src="/404.svg" />
				<h1>Page Not Found</h1>
				<button className="not_found_button" onClick={() => navigate("/")}>Go Homepage</button>
			</div>
		</>
	);
}
