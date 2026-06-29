import { Link, useSearchParams } from "react-router-dom";

export default function OAuthError() {
    const [params] = useSearchParams();
    const error = params.get("error");

    return (
    <div>
        <h1>Error al iniciar sesión con Google</h1>
        <p>{error || "No se pudo completar el inicio de sesión."}</p>
        <Link to="/auth/login">Volver al login</Link>
    </div>
    );
}