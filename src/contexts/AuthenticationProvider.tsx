import { AuthenticationContext } from "./AuthenticationContext";

export function AuthenticationProvider({ children }: { children: React.ReactNode }) {
	const token = localStorage.getItem("token");
	const { sub, scope } = JSON.parse(atob(token!.split(".")[1]));
	return (
		<>
			<AuthenticationContext.Provider value={{ username: sub, scope }}>{children}</AuthenticationContext.Provider>
		</>
	);
}
