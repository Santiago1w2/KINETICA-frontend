export type PredictionItem = {
    timestamp?: number
    frame?: number
    sign?: string
}

export type ModelResponse = {
    file?: string
    total_frames?: number
    fps?: number
    predictions?: PredictionItem[]
    error?: string
}

export type TranslationResponse = {
    requestId?: number
    id?: number
    status?: string
    textOutput?: string | null
    glossOutput?: string | null
    signOutputRef?: string | null
    confidence?: number | null
    warning?: string | null
    modelVersion?: string | null
}