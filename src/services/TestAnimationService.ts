import type { AnimationData } from '../types/type'

const TEST_ANIMS_URL = '/TestAnimations/animations.json'

export const fetchTestAnimations = async (): Promise<AnimationData[]> => {
    const response = await fetch(TEST_ANIMS_URL)
    if (!response.ok) {
        throw new Error('Failed to load test animations')
    }
    return response.json()
}
