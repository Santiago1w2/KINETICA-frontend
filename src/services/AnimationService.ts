import api from '../api/axios'
import type { AnimationResponse } from '../types/type'

export const fetchAnimation = async (id?: number) => {
    const response = await api.get<AnimationResponse>(`/animations${id ? `/${id}` : '/latest'}`)
    return response.data
}
