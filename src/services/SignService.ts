import api from '../api/axios'
import type { SignResponse } from '../types/sings/type'

export async function fetchSigns(): Promise<SignResponse[]> {
    const response = await api.get<SignResponse[]>('/signs')
    return response.data
}

export async function fetchSign(id: number): Promise<SignResponse> {
    const response = await api.get<SignResponse>(`/signs/${id}`)
    return response.data
}

export async function fetchSignsByIds(ids: number[]): Promise<SignResponse[]> {
    return Promise.all(ids.map((id) => fetchSign(id)))
}
