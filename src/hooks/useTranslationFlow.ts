import { useMemo, useState } from 'react'
import type { ModelResponse, PredictionItem, TranslationResponse } from '../types/translator/type'
import { createTranslation, pollTranslation } from '../services/translationService'
import { getRawPredictionText, sendVideoToPython } from '../services/ModelService'


export function useTranslationFlow() {
    const [predictions, setPredictions] = useState<PredictionItem[]>([])
    const [sourceText, setSourceText] = useState('')
    const [finalText, setFinalText] = useState('')
    const [status, setStatus] = useState('Listo para grabar.')
    const [error, setError] = useState('')
    const [isSendingModel, setIsSendingModel] = useState(false)
    const [isSendingBackend, setIsSendingBackend] = useState(false)

    const predictionText = useMemo(
        () => getRawPredictionText(predictions),
        [predictions]
    )

    const handleModelResult = (body: ModelResponse) => {
        const nextPredictions = body.predictions ?? []
        const predictedText = getRawPredictionText(nextPredictions)
        setPredictions(nextPredictions)
        setSourceText(predictedText)
        return predictedText
    }

    const submitVideo = async (blob: Blob) => {
        setError('')
        setIsSendingModel(true)
        setStatus('Enviando video al modelo...')
        try {
            const predictedText = await sendVideoToPython(blob)
            setPredictions([])
            setSourceText(predictedText)
            setStatus('Prediccion recibida desde el modelo.')
            return predictedText
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error enviando al modelo')
            setStatus('Error con el modelo.')
            return ''
        } finally {
            setIsSendingModel(false)
        }
    }

    const submitToBackend = async (text?: string) => {
        const textToTranslate = text ?? sourceText

        if (!textToTranslate.trim()) {
            setError('Nose pudo traducir')
            return
        }

        setError('')
        setIsSendingBackend(true)
        setFinalText('')
        setStatus('Enviando al backend...')

        try {
            const requestId = await createTranslation('SIGN_TO_TEXT', textToTranslate)
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
