import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL


export const login = async (data:any) => {
    const response = await axios.post(`${API_URL}/auth/login`,data)
    console.log(response)
    console.log(response.data)
    return response.data;
}

export const register = async (data:any) => {
    const response = await axios.post(`${API_URL}/auth/register`,data)
    console.log(response)
    console.log(response.data)    
    return response.data;
}