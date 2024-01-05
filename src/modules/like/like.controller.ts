import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { Client } from 'src/commons/decorators';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { ResTransformInterceptor } from 'src/interceptors/response.interceptor';

@Controller('like')
@UseInterceptors(ResTransformInterceptor)
export class LikeController {
    constructor(protected readonly likeService: LikeService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get like note successfully!')
    public async getLikeNoteByUserId(@Client() clientData: ClientData) {
        return await this.likeService.getLikeNoteByUserId(clientData);
    }

    @Post('/:noteId')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Like / Unlike note successfully!')
    public async handleLike(
        @Client() clientData: ClientData,
        @Param('noteId') noteId: string,
    ) {
        return await this.likeService.handleLike(clientData, noteId);
    }
}
