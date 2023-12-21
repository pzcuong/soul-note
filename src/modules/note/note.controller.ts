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
import { NoteService } from './note.service';
import { ResTransformInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { Client } from 'src/commons/decorators';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { CreateNoteDto } from './dto/create-note.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetNoteDataQuery } from './dto/query-param.dto';

@Controller('note')
@UseInterceptors(ResTransformInterceptor)
export class NoteController {
    constructor(private readonly noteService: NoteService) {}

    @Get('/me/draft')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get draft note successfully!')
    public async getDraftNoteByUserId(@Client() clientData: ClientData) {
        return await this.noteService.getDraftNoteByUserId(clientData);
    }

    @Get('/me')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get note successfully!')
    public async getNoteByUserId(@Client() clientData: ClientData) {
        return await this.noteService.getNoteByUserId(clientData);
    }

    @Post()
    @UseInterceptors(FileInterceptor('attachFile'))
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Create/update note successfully!')
    public async createDraftNote(
        @Client() clientData: ClientData,
        @Body() payload: CreateNoteDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.noteService.createDraftNote(
            clientData,
            payload,
            file,
        );
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
        @Param('id') id: string,
    ) {
        return await this.noteService.deleteNote(clientData, id);
    }

    @Patch('/:id')
    @UseInterceptors(FileInterceptor('attachFile'))
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Update note successfully!')
    public async updateNote(
        @Client() clientData: ClientData,
        @Param('id') id: string,
        @Body() payload: CreateNoteDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.noteService.updateNote(clientData, id, payload, file);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get all public successfully!')
    public async getNote(@Query() queryParams: GetNoteDataQuery) {
        return await this.noteService.getAllPublicNote(queryParams);
    }
}
