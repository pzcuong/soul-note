import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ResTransformInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { Client } from 'src/commons/decorators';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@sentry/node';
import { Note } from 'src/models/entities/note.entity';
import { SentryInterceptor } from 'src/commons/sentry.filter';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';

@Controller('comment')
@UseInterceptors(SentryInterceptor)
@UseInterceptors(ResTransformInterceptor)
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Create/update comment successfully!')
    public async createComment(
        @Client() clientData: ClientData,
        @Body() payload: CreateCommentDTO,
    ) {
        return await this.commentService.createComment(clientData, payload);
    }
}

export interface NoteWithUser extends Note {
    user?: User;
}
