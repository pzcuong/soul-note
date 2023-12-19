import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { ResTransformInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { Client } from 'src/commons/decorators';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { ObjectId } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';

@Controller('note')
@UseInterceptors(ResTransformInterceptor)
export class NoteController {
    constructor(private readonly noteService: NoteService) {}

    @Get('/draft')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get draft note successfully!')
    public async getDraftNoteByUserId(@Client() clientData: ClientData) {
        return await this.noteService.getDraftNoteByUserId(clientData);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get note successfully!')
    public async getNoteByUserId(@Client() clientData: ClientData) {
        return await this.noteService.getNoteByUserId(clientData);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Create/update note successfully!')
    public async createDraftNote(
        @Client() clientData: ClientData,
        @Body() payload: CreateNoteDto,
    ) {
        return await this.noteService.createDraftNote(clientData, payload);
    }

    @Post('/publish')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Public draft note successfully!')
    public async publicDraftNote(@Client() clientData: ClientData) {
        return await this.noteService.publicDraftNote(clientData);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Delete note successfully!')
    public async deleteDraftNote(
        @Client() clientData: ClientData,
        @Param('id') id: ObjectId,
    ) {
        return await this.noteService.deleteNote(clientData, id);
    }
}
