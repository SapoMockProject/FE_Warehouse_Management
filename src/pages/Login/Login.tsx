import React from "react";
import InputComponent from "./Input/InputComponent";
import "./Login.css";
import { axiosConfiguration } from "../../configurations/AxiosConfiguration";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [loginValue, setLoginValue] = React.useState({ username: "", password: "" });
	const [errors, setErrors] = React.useState<{ username?: string; password?: string }>({});
	const navigate = useNavigate();
	const login = async () => {
		if (!loginValue.username) {
			setErrors((prev) => ({ ...prev, username: "Vui lòng nhập username" }));
			return;
		}
		if (!loginValue.password) {
			setErrors((prev) => ({ ...prev, password: "Vui lòng nhập mật khẩu" }));
			return;
		}
		if (loginValue.username.length < 8) {
			setErrors((prev) => ({ ...prev, username: "Username phải có ít nhất 8 ký tự" }));
			return;
		}
		if (loginValue.password.length < 8) {
			setErrors((prev) => ({ ...prev, password: "Mật khẩu phải có ít nhất 8 ký tự" }));
			return;
		}
		const response = await axiosConfiguration.post("/auth/login", loginValue);
		const token = response.data.data.token;
		localStorage.setItem("token", token);
		navigate("/dashboard");
	}
	return (
		<>
			<div className="container">
				<div className="content">
					<div className="logo">
						<img
							src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/logo/Sapo-logo.svg?v=202101071107"
							alt="Sapo Logo"
						/>
					</div>
					<div className="model_content">
						<InputComponent
							value={loginValue.username}
							placeholder="Username của bạn"
							error={errors.username}
							title="Username"
							required
							onChange={(e) => setLoginValue((prev) => ({ ...prev, username: e.target.value }))}
						/>
						<InputComponent
							value={loginValue.password}
							placeholder="Mật khẩu của bạn"
							type="password"
							error={errors.password}
							title="Mật khẩu"
							required
							onChange={(e) => setLoginValue((prev) => ({ ...prev, password: e.target.value }))}
						/>
						<button onClick={login} className="login_button">Đăng nhập</button>
					</div>
				</div>
			</div>
		</>
	);
}
