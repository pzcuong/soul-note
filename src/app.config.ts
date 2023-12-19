/* eslint-disable prettier/prettier */
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });
export const AppConfig = {
    APP_NAME: 'SENDA',
    PUBLIC_ENDPOINT_METADATA: 'isPublic',
    REFRESH_TOKEN_EXPIRES: 100,
    ACCESS_TOKEN_EXPIRES: '365d',
    UPLOAD_PHOTOS_LIMIT: 6,
    UPLOAD_PHOTO_MAX_FILE_SIZE: 10 * 1024 * 1024,
    USER_ROLES_KEY: 'roles',
};
