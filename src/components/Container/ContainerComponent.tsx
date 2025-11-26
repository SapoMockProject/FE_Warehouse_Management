import React from "react";
import { useNavigate } from "react-router-dom";

export default function ContainerComponent({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	React.useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
			return;
		}
		const exp: number = JSON.parse(atob(token!.split(".")[1]));
		if (Date.now() >= exp * 1000) {
			localStorage.removeItem("token");
			navigate("/login");
		}
		if (token) {
			if (window.location.pathname === "/login") {
				navigate("/");
			}
		}
	}, [navigate]);
	return <>{children}</>;
}
