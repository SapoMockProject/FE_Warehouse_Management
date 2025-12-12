import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyAccount } from "../../apis/employeeApi";
import type { BaseResponse } from "../../types/BaseResponse";
import type { AuthenticationResponse } from "../../types/IUser";

export default function VerifyAccountPage() {
    const [searchParams] = useSearchParams(window.location.search);
    const [isLoading, setIsLoading] = React.useState(true);
    const navigate = useNavigate();
    React.useEffect(() => {
        const token = searchParams.get("token");
        const fetchVerify = async () => {
            if (token) {
                try {
                    const response = await verifyAccount(token);
                    console.log("Account verified successfully:", response);
                    setIsLoading(false);
                    const tokenJwt = (response as BaseResponse<AuthenticationResponse>).data.token;
                    localStorage.setItem("token", tokenJwt);
                    navigate("/");
                } catch (error) {
                    console.error("Error verifying account:", error);
                }
            }
        }
        fetchVerify();
    }, [searchParams, navigate]);
	return <>
        <h1>{isLoading ? "Verifying your account..." : "Account verified successfully!"}</h1>
    </>;
}
