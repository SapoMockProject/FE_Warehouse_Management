import React from "react";
import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { IUserResponse } from "../types/IUser";
import { AuthenticationContext } from "./AuthenticationContext";
import { Outlet } from "react-router-dom";

export function AuthenticationProvider() {
	const token = localStorage.getItem("token");
	const [user, setUser] = React.useState<({ user: IUserResponse } & { refreshUser: () => void }) | null>(null);
	const [reload, setReload] = React.useState(false);
	const refreshUser = () => setReload((prev) => !prev);
	React.useEffect(() => {
		if (!user) {
			const fetchUser = async () => {
				const response = await axiosConfiguration.get("/users/me", {
					headers: {
						Authorization: `Bearer ${token || ""}`,
					},
				});
				setUser(() => ({
					user: (response.data as BaseResponse<IUserResponse>).data,
					refreshUser: refreshUser,
				}));
			};
			fetchUser();
		}
	}, [token, user, reload]);
	return (
		<>
			<AuthenticationContext.Provider value={user}>
				<Outlet />
			</AuthenticationContext.Provider>
		</>
	);
}
