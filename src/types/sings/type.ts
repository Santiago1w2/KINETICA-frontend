export interface SignResponse {
    id: number;
    label: string;
    normalizedLabel: string;
    mediaRef: string;
    locale: string;
    active: boolean;
    animationSrc: string | null;
}
