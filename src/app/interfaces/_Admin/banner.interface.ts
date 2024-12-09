export interface Banner {
    id: number;
    link: string | null;
    category: string;
    image: string | null;
}

export interface BannerResponse {
    id: number;
    link?: string;
    category: string;
    image?: string;
}

export interface BannerUpdate {
    id: number;
    link?: string;
    category?: string;
    image?: File | null;
}