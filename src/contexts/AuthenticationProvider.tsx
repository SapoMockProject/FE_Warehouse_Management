import React from "react";
import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { IUserResponse } from "../types/IUser";
import { AuthenticationContext } from "./AuthenticationContext";

export function AuthenticationProvider({ children }: { children: React.ReactNode }) {
	const token = localStorage.getItem("token");
	const [user, setUser] = React.useState<IUserResponse | null>(null);
	React.useEffect(() => {
		const fetchUser = async () => {
			const response = await axiosConfiguration.get("/users/me", {
				headers: {
					Authorization: `Bearer ${token || ""}`,
				},
			});
			setUser((response.data as BaseResponse<IUserResponse>).data);
		}
		fetchUser();
	}, [token]);
	return (
		<>
			<AuthenticationContext.Provider value={user}>{children}</AuthenticationContext.Provider>
		</>
	);
}
