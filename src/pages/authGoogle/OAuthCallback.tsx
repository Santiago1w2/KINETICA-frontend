import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getMe } from "../../services/AuthService";

export default function OAuthCallback() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const init = async () => {
            try {
                const accessToken = params.get("accessToken");
                const refreshToken = params.get("refreshToken");

                if (!accessToken || !refreshToken) {
                    navigate("/auth/error?error=oauth_failed");
                    return;
                }

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                const user = await getMe();
                console.log(user.data)

                login({
                    userId: user.userId,
                    email: user.email,
                    username: user.username,
                    accessToken,
                    refreshToken,
                    tokentype: "Bearer",
                });

                navigate("/dashboard");

            } catch (err) {
                navigate("/auth/error?error=oauth_failed");
            }
        };

        init();
    }, []);

    return <p>Iniciando sesión...</p>;
}