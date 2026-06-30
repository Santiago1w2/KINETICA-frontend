import type { AnimationResponse } from '../types/animations/type'

export const fetchAnimation = async (): Promise<AnimationResponse> => {
    throw new Error('El endpoint de animaciones no esta disponible. Usa /signs para cargar senas.')
}
