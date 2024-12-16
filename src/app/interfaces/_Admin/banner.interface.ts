export interface Banner {
    id: number;
    link: string | null;
    category: string;
    media: string[]; // Массив строк для хранения путей к изображениям
}

export interface BannerResponse {
    id: number;
    link?: string;
    category: string;
    media?: string[]; // Массив строк для изображений
}

export interface BannerUpdate {
    id: number;
    link?: string;
    category?: string;
    media?: File[]; // Массив файлов для загрузки новых изображений
}
