import { useMemo, useState } from 'react'
import type { ModelResponse, PredictionItem, TranslationResponse } from '../types/translator/type'
import { createTranslation, pollTranslation } from '../services/translationService'
import { sendVideoToModel } from '../services/ModelService'

function uniqueConsecutiveSigns(predictions: PredictionItem[]) {
    const signs: string[] = []
    for (const item of predictions) {
        const sign = (item.sign ?? '').trim()
        if (sign && signs[signs.length - 1] !== sign) {
        signs.push(sign)
        }
    }
    return signs
}

export function useTranslationFlow() {
    const [predictions, setPredictions] = useState<PredictionItem[]>([])
    const [sourceText, setSourceText] = useState('')
    const [finalText, setFinalText] = useState('')
    const [status, setStatus] = useState('Listo para grabar.')
    const [error, setError] = useState('')
    const [isSendingModel, setIsSendingModel] = useState(false)
    const [isSendingBackend, setIsSendingBackend] = useState(false)

    const predictionText = useMemo(
        () => uniqueConsecutiveSigns(predictions).join(' '),
        [predictions]
    )

    const handleModelResult = (body: ModelResponse) => {
        const nextPredictions = body.predictions ?? []
        setPredictions(nextPredictions)
        setSourceText(uniqueConsecutiveSigns(nextPredictions).join(' '))
    }

    const submitVideo = async (blob: Blob) => {
        setError('')
        setIsSendingModel(true)
        setStatus('Enviando video al modelo...')
        try {
            const body = await sendVideoToModel(blob)
            handleModelResult(body)
            setStatus('Prediccion recibida desde el modelo.')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error enviando al modelo')
            setStatus('Error con el modelo.')
        } finally {
            setIsSendingModel(false)
        }
    }

    const submitToBackend = async () => {
        if (!sourceText.trim()) {
            setError('No hay texto para enviar al backend.')
        return
    }

        setError('')
        setIsSendingBackend(true)
        setFinalText('')
        setStatus('Enviando al backend...')

    try {
        const requestId = await createTranslation(sourceText.trim())
        setStatus('Backend acepto la traduccion. Consultando resultado...')
        const result: TranslationResponse = await pollTranslation(requestId)
        setFinalText(result.textOutput ?? '')
        setStatus('Oracion mejorada recibida.')
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Error enviando al backend')
        setStatus('Error con el backend.')
    } finally {
        setIsSendingBackend(false)
    }
    }

    return {
        predictions,
        predictionText,
        sourceText,
        setSourceText,
        finalText,
        status,
        error,
        setError,
        setStatus,
        isSendingModel,
        isSendingBackend,
        handleModelResult,
        submitVideo,
        submitToBackend,
    }
}