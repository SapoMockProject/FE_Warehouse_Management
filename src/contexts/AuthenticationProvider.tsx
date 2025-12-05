import React from "react";
import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { IUserResponse } from "../types/IUser";
import { AuthenticationContext } from "./AuthenticationContext";
import { Outlet } from "react-router-dom";

export function AuthenticationProvider() {
	const token = localStorage.getItem("token");
	const [user, setUser] = React.useState<IUserResponse | null>(null);
	console.log(window.location.href);
	React.useEffect(() => {
		if (!user) {
			const fetchUser = async () => {
				const response = await axiosConfiguration.get("/users/me", {
					headers: {
						Authorization: `Bearer ${token || ""}`,
					},
				});
				setUser((response.data as BaseResponse<IUserResponse>).data);
			};
			fetchUser();
		}
		console.log("AuthenticationProvider - user:", user);
	}, [token, user]);
	return (
		<>
			<AuthenticationContext.Provider value={user}>
				<Outlet />
			</AuthenticationContext.Provider>
		</>
	);
}
