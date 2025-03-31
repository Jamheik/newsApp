import { ObjectId } from 'mongodb';

export interface Feed {
    _id?: ObjectId;
    feed_url: string;
    feed_name?: string;
}

export interface Article {
    _id?: ObjectId;
    feed_id: ObjectId;
    unique_id: string | null;
    link: string;
    pub_date?: string;
    iso_date?: string;
    image?: string | null;
    categories: string[];
}

export interface ArticleContext {
    _id?: ObjectId;
    article_id: ObjectId;
    language_code: string;
    title: string;
    full_text: string;
    version: number;
    created_at: Date;
}

export interface ArticleAttachment {
    _id?: ObjectId;
    article_id: ObjectId;
    attachment_type: string;
    attachment_url: string;
    local_path?: string;
    created_at: Date;
}


export interface WeatherCondition {
    main: string;
    description: string;
    icon?: string;
}

export interface Weather {
    location: string;
    country: string;
    temperature: number;
    feels_like?: number;
    humidity?: number;
    wind_speed?: number;
    conditions: WeatherCondition[];
    timestamp: string;
}
