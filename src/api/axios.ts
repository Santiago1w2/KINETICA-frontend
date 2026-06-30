import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    }

)

api.interceptors.request.use((config)=>{
    const accessToken = localStorage.getItem('accessToken');

    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;

    },
    (error)=>{
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const response = await axios.post(
                    `${BASE_URL}/auth/refresh`,
                    {
                        refreshToken
                    },
                    {
                        withCredentials: true
                    }
                );

                const {
                    accessToken,
                    refreshToken: newRefreshToken
                } = response.data;

                // Guardar los nuevos tokens
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                originalRequest.headers.Authorization =
                    `Bearer ${accessToken}`;

                return api(originalRequest);

            } catch (refreshError) {



                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userId");
                localStorage.removeItem("email");
                localStorage.removeItem("username");

                window.location.href = "/auth/login";

                throw refreshError;
            }
        }

        throw error;
    }
);
export default api;
