import api from '../api/axios'
import type { TranslationResponse } from '../types/translator/type'

export async function createTranslation(sourceText: string) {
    const response = await api.post<TranslationResponse>('/translations', {
        direction: 'SIGN_TO_TEXT',
        sourceText,
    })

    const created = response.data
    const requestId = String(created.requestId ?? created.id ?? '')

    if (!requestId) {
        throw new Error('El backend no devolvio requestId.')
    }

    return requestId
}

export async function pollTranslation(requestId: string) {
    for (let attempt = 0; attempt < 20; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const response = await api.get<TranslationResponse>(`/translations/${requestId}`)
        const data = response.data

        if (data.status === 'DONE' || data.textOutput) {
        return data
        }

        if (data.status === 'FAILED') {
            throw new Error(data.warning || 'La traduccion fallo en el backend.')
        }
    }
    throw new Error('El backend aun no termina la traduccion.')
}