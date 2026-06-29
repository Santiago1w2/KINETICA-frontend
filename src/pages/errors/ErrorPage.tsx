import { useSearchParams } from "react-router-dom";

export function ErrorPage() {
    const [searchParams] = useSearchParams();

    const code = searchParams.get("code");
    const message = searchParams.get("message");

    return (
        <>  
<div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
    <h1 className="text-4xl font-bold text-blue-600">
        ¡Ups! Ocurrió un error
    </h1>

    <h2 className="mt-4 text-9xl font-extrabold text-blue-600">
        {code}
    </h2>

    <p className="mt-4 text-lg text-gray-800">
        {message}
    </p>
</div>
        </>
    );
}