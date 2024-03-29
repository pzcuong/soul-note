import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.response';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
    uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'Nestjs',
                    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    deleteFile(url: string): Promise<CloudinaryResponse> {
        const public_id = url.match(/\/upload\/v\d+\/(.+)\./)[1];

        return new Promise<CloudinaryResponse>((resolve, reject) => {
            cloudinary.uploader.destroy(
                public_id,
                { invalidate: true },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
        });
    }
}
