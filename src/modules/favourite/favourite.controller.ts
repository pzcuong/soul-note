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
import { FavouriteService } from './favourite.service';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { Client } from 'src/commons/decorators';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { ResTransformInterceptor } from 'src/interceptors/response.interceptor';

@Controller('favourite')
@UseInterceptors(ResTransformInterceptor)
export class FavouriteController {
    constructor(protected readonly favouriteService: FavouriteService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get favourite note successfully!')
    public async getFavouriteNoteByUserId(@Client() clientData: ClientData) {
        return await this.favouriteService.getFavouriteNoteByUserId(clientData);
    }

    @Post('/:noteId')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Add favourite note successfully!')
    public async addFavouriteNoteByUserId(
        @Client() clientData: ClientData,
        @Param('noteId') noteId: string,
    ) {
        return await this.favouriteService.addFavouriteNoteByUserId(
            clientData,
            noteId,
        );
    }

    @Delete('/:noteId')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Remove favourite note successfully!')
    public async removeFavouriteNoteByUserId(
        @Client() clientData: ClientData,
        @Param('noteId') noteId: string,
    ) {
        return await this.favouriteService.removeFavouriteNoteByUserId(
            clientData,
            noteId,
        );
    }
}
