import api from '../api/axios'
import type { AnimationResponse } from '../types/animations/type'
import type { SignResponse } from '../types/sings/type'

export const fetchAnimation = async (id?: number) => {
    const response = await api.get<AnimationResponse>(`/animations${id ? `/${id}` : '/latest'}`)
    return response.data
}

export const fetchSign = async (id: number): Promise<SignResponse> => {
    const response = await api.get<SignResponse>(`/signs/${id}`)
    return response.data
}

export const fetchSigns = async (ids: number[]): Promise<SignResponse[]> => {
    return Promise.all(ids.map((id) => fetchSign(id)))
}
