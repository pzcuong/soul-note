import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { SentryInterceptor } from 'src/commons/sentry.filter';
import { ResTransformInterceptor } from 'src/interceptors/response.interceptor';
import { FollowService } from './follow.service';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { Client } from 'src/commons/decorators';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { GetNoteDataQuery } from '../note/dto/query-param.dto';

@Controller('follow')
@UseInterceptors(SentryInterceptor)
@UseInterceptors(ResTransformInterceptor)
export class FollowController {
    constructor(private readonly followService: FollowService) {}

    @Post('/:userId')
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Follow / unfollow user successfully')
    async followUser(
        @Client() clientData: ClientData,
        @Param('userId') id: string,
    ) {
        return await this.followService.followUser(clientData, id);
    }

    @Get('/note')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get all public successfully!')
    public async getNoteByFollow(
        @Client() clientData: ClientData,
        @Query() queryParams: GetNoteDataQuery,
    ) {
        return await this.followService.getNoteByFollow(
            clientData,
            queryParams,
        );
    }
}
