import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function ContainerComponent({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const location = useLocation();

	React.useEffect(() => {
		if (location.pathname !== "/verify-account") {
			const token = localStorage.getItem("token");

			if (!token && location.pathname !== "/login") {
				navigate(`/login?${params.toString()}`, {
					state: { reason: "unauthorized" },
				});
				return;
			}

			if (token) {
				const { exp } = JSON.parse(atob(token.split(".")[1]));

				if (Date.now() >= exp * 1000) {
					localStorage.removeItem("token");
					navigate("/login", {
						replace: true,
						state: { reason: "expired" },
					});
					return;
				}

				if (location.pathname === "/login") {
					navigate("/");
				}
			}
		}
	}, [navigate, params, location]);

	return <>{children}</>;
}
