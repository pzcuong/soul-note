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
    UseInterceptors,
} from '@nestjs/common';
import { ResTransformInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { Client } from 'src/commons/decorators';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { User } from '@sentry/node';
import { Note } from 'src/models/entities/note.entity';
import { SentryInterceptor } from 'src/commons/sentry.filter';
import { CommentService } from './comment.service';
import { CreateCommentDTO, UpdateCommentDTO } from './dto/create-comment.dto';
import { Comment } from 'src/models/entities/comment.enity';

@Controller('comment')
@UseInterceptors(SentryInterceptor)
@UseInterceptors(ResTransformInterceptor)
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Create comment successfully!')
    public async createComment(
        @Client() clientData: ClientData,
        @Body() payload: CreateCommentDTO,
    ) {
        return await this.commentService.createComment(clientData, payload);
    }

    @Get('/:note_id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get comments by note id successfully!')
    public async getCommentsByNoteId(@Param('note_id') note_id: string) {
        return await this.commentService.getCommentsByNoteId(note_id);
    }

    @Delete('/:comment_id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Delete comment successfully!')
    public async deleteComment(
        @Client() clientData: ClientData,
        @Param('comment_id') comment_id: string,
    ) {
        return await this.commentService.deleteComment(clientData, comment_id);
    }

    @Patch('/:comment_id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Update comment successfully!')
    public async updateComment(
        @Client() clientData: ClientData,
        @Param('comment_id') comment_id: string,
        @Body() payload: UpdateCommentDTO,
    ) {
        return await this.commentService.updateComment(
            clientData,
            comment_id,
            payload,
        );
    }
}

export interface NoteWithUser extends Note {
    user?: User;
}

export interface CommentWithReplies extends Comment {
    replies?: Comment[];
}
