import api from '../api/axios'
import type { SignRequest, SignResponse } from '../types/sings/type'

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

export async function createSign(data: SignRequest): Promise<SignResponse> {
    const response = await api.post<SignResponse>('/signs', data)
    return response.data
}

export async function updateSign(id: number, data: SignRequest): Promise<SignResponse> {
    const response = await api.put<SignResponse>(`/signs/${id}`, data)
    return response.data
}

export async function patchSign(id: number, data: Partial<SignRequest>): Promise<SignResponse> {
    const response = await api.patch<SignResponse>(`/signs/${id}`, data)
    return response.data
}

export async function deleteSign(id: number): Promise<void> {
    await api.delete(`/signs/${id}`)
}
