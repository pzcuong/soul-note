import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { ModelsModule } from 'src/models/models.module';

@Module({
    controllers: [CommentController],
    providers: [CommentService],
    imports: [ModelsModule],
})
export class CommentModule {}
