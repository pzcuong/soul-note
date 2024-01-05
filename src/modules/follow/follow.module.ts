import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { ModelsModule } from 'src/models/models.module';

@Module({
    imports: [ModelsModule],
    controllers: [FollowController],
    providers: [FollowService],
})
export class FollowModule {}
