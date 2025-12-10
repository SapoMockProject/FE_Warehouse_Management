import React from "react";
import { Outlet } from "react-router-dom";
import { getMyInfo } from "../apis/employeeApi";
import type { BaseResponse } from "../types/BaseResponse";
import type { IUserResponse } from "../types/IUser";
import { AuthenticationContext } from "./AuthenticationContext";

export function AuthenticationProvider() {
	
	const [user, setUser] = React.useState<({ user: IUserResponse } & { refreshUser: () => void }) | null>(null);
	const [reload, setReload] = React.useState(false);
	const refreshUser = () => setReload((prev) => !prev);
	React.useEffect(() => {
		const fetchUser = async () => {
			const response = await getMyInfo();
			setUser(() => ({
				user: (response.data as BaseResponse<IUserResponse>).data,
				refreshUser: refreshUser,
			}));
		};
		fetchUser();
	}, [reload]);
	return (
		<>
			<AuthenticationContext.Provider value={user}>
				<Outlet />
			</AuthenticationContext.Provider>
		</>
	);
}
