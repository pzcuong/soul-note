declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Node env
            NODE_ENV: 'test' | 'development' | 'production' | 'staging';
            // App
            API_PORT: string;
            // //  Database
            POSTGRES_DB_HOST: string;
            POSTGRES_DB_PORT: string;
            POSTGRES_DB_NAME: string;
            POSTGRES_USER: string;
            POSTGRES_PASS: string;
            POSTGRES_SSL: string;

            // // Redis
            REDIS_URI: string;

            // Secret
            JWT_SECRET_KEY: string;
            HASH_SECRET_KEY: string;
            ADMIN_PASSWORD: string;
            ADMIN_EMAIL: string;
            CBC_SECRET_KEY: string;
            CBC_SECRET_IV: string;
            CBC_METHOD: string;

            BINARY_KEY_IV: string;
            SECRET_KEY_PASSWORD: string;
        }
    }
}

export {};
