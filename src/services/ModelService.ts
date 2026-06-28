import type { ModelResponse } from '../types/translator/type'

const MODEL_API_URL =
    import.meta.env.VITE_MODEL_API_URL ?? 'http://127.0.0.1:8000/predict_video'

async function readJsonOrEmpty(response: Response) {
    const text = await response.text()
    if (!text.trim()) return {}
    try {
        return JSON.parse(text)
    } catch {
        return { error: text }
    }
}

function formatHttpError(response: Response, body: Record<string, unknown>) {
    const detail =
        (body.message as string | undefined) ??
        (body.error as string | undefined) ??
        (body.warning as string | undefined) ??
        response.statusText ??
        'Respuesta sin detalle'

    return `HTTP ${response.status}: ${detail}`
}

export async function sendVideoToModel(blob: Blob): Promise<ModelResponse> {
    const extension = blob.type.includes('mp4') ? 'mp4' : 'webm'
    const formData = new FormData()
    formData.append('file', blob, `traduccion.${extension}`)

    const response = await fetch(MODEL_API_URL, {
        method: 'POST',
        body: formData,
    })

    const body = (await readJsonOrEmpty(response)) as ModelResponse

    if (!response.ok || body.error) {
        throw new Error(body.error || formatHttpError(response, body as Record<string, unknown>))
    }

    return body
}