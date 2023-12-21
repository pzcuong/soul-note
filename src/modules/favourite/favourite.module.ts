import { Module } from '@nestjs/common';
import { FavouriteController } from './favourite.controller';
import { FavouriteService } from './favourite.service';
import { ModelsModule } from 'src/models/models.module';

@Module({
    imports: [ModelsModule],
    controllers: [FavouriteController],
    providers: [FavouriteService],
})
export class FavouriteModule {}
