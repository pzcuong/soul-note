import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
    type: 'mongodb',
    url: `${process.env.MONGODB_URI}`,
    entities: ['src/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: true,
} satisfies DataSourceOptions;

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
