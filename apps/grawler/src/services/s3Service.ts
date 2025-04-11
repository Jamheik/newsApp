import axios from 'axios';
import path from 'path';
import {  S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

let r2Client: S3Client

// Create an S3-compatible client instance for Cloudflare R2
// R2 is compatible with S3's API, so we can use the same SDK

// Renaming function to be more generic while maintaining backward compatibility
export async function uploadImageToS3(imageUrl: string): Promise<string | null | undefined> {
    if (!r2Client || !r2Client.config.credentials) {
        r2Client = new S3Client({
            region: 'auto', // R2 doesn't use regions like AWS but requires a value
            endpoint: `${process.env.CLOUDFLARE_R2_ENDPOINT}`, // Your R2 endpoint URL
            credentials: {
                accessKeyId: `${process.env.CLOUDFLARE_R2_ACCESS_KEY_ID}`,
                secretAccessKey: `${process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY}`
            }
        });
    }

    return uploadImageToStorage(imageUrl);
}

export async function uploadImageToStorage(imageUrl: string): Promise<string | null | undefined> {
    try {
        // Download the image using axios
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = response.data;
        const fileName = `${Date.now()}_${path.basename(imageUrl)}`;

        // Prepare the upload parameters
        const params = {
            Bucket: process.env.CLOUDFLARE_R2_BUCKET || 'r2bucket',
            Key: fileName,
            Body: buffer,
            ContentType: response.headers['content-type']
        };

        const parallelUpload = new Upload({
            client: r2Client,
            params
        });

        const result = await parallelUpload.done();

        const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL
            ? `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`
            : `${process.env.CLOUDFLARE_R2_ENDPOINT}/${params.Bucket}/${fileName}`;
            
        console.log(`Uploaded image to R2: ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        console.error('Error uploading image to R2:', error);
        return null;
    }
}
