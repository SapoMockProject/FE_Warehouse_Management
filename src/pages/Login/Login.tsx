import type { AxiosError } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { loginGoogle } from "../../apis/authApi";
import Button from "../../components/Button/Button";
import { axiosConfiguration } from "../../configurations/AxiosConfiguration";
import type { BaseResponse } from "../../types/BaseResponse";
import InputComponent from "./Input/InputComponent";
import "./Login.css";

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
		try {
			const response = await axiosConfiguration.post("/auth/login", loginValue);
			const token = response.data.data.token;
			localStorage.setItem("token", token);
			navigate("/dashboard");
		} catch (error) {
			const status = (error as AxiosError).status;
			if (status === 401) {
				setErrors({ username: "Sai username hoặc mật khẩu", password: "Sai username hoặc mật khẩu" });
				return;
			}
			if (status === 500) {
				setErrors({ username: "Lỗi máy chủ, vui lòng thử lại sau", password: "Lỗi máy chủ, vui lòng thử lại sau" });
				return;
			}
			const message = ((error as AxiosError).response?.data as BaseResponse<string>).message;
			setErrors({ username: message, password: message });
		}
	};
	const handleRedirect = () => {
		window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?
			scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email&
			access_type=offline&
			include_granted_scopes=true&
			response_type=code&
			state=state_parameter_passthrough_value&
			redirect_uri=http://localhost:5173/login&
			client_id=${import.meta.env.VITE_PUBLIC_CLIENT_ID}&prompt=consent`;
	};
	React.useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");
		const prompt = urlParams.get("prompt");
		if (code && prompt) {
			const fetchToken = async () => {
				const response = await loginGoogle(code);
				const token = (response as BaseResponse<{ token: string }>).data.token;
				localStorage.setItem("token", token);
				navigate("/dashboard");
			};
			fetchToken();
		}
	}, [navigate]);
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
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									login();
								}
							}}
							onChange={(e) => setLoginValue((prev) => ({ ...prev, username: e.target.value }))}
						/>
						<InputComponent
							value={loginValue.password}
							placeholder="Mật khẩu của bạn"
							type="password"
							error={errors.password}
							title="Mật khẩu"
							required
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									login();
								}
							}}
							onChange={(e) => setLoginValue((prev) => ({ ...prev, password: e.target.value }))}
						/>
						<button onClick={login} className="login_button">
							Đăng nhập
						</button>
					</div>
					<div className="login_subtext_login_social">Hoặc đăng nhập với</div>
					<div className="login_social_button_wrapper">
						<Button
							onClick={handleRedirect}
							className="login_google_btn"
							label="Login With Google"
							icon={<img width={20} height={20} src={"/google-icon-logo-svgrepo-com.svg"} alt="Google Icon" />}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
