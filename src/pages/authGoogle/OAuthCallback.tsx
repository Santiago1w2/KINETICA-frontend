import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function OAuthCallback() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const oauth = params.get("oauth");
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");
        const userId = params.get("userId");
        const email = params.get("email");
        const tokenType = params.get("tokenType");

        if (oauth === "success" && accessToken && refreshToken && userId) {
            login({
                userId: Number(userId),
                email: email || "",
                accessToken,
                refreshToken,
                tokentype: tokenType || "Bearer",
            });
            navigate("/dashboard");
        } else {
            navigate("/auth/error?error=oauth_failed");
        }
    }, [params,login,navigate]);

    return <p>Iniciando sesión...</p>;
}
