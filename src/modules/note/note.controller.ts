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
import { GetNoteDataQuery, GetNoteById } from './dto/query-param.dto';
import { User } from '@sentry/node';
import { Note } from 'src/models/entities/note.entity';
import { SentryInterceptor } from 'src/commons/sentry.filter';

@Controller('note')
@UseInterceptors(SentryInterceptor)
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

    @Get('/:note_id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get note by id successfully!')
    public async GetNoteById(
        @Client() clientData: ClientData,
        @Param('note_id') note_id: string,
    ) {
        return await this.noteService.getNoteById(note_id, clientData);
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

    @Post('/create-public')
    @UseInterceptors(FileInterceptor('attachFile'))
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Create/update note successfully!')
    public async createPublicNote(
        @Client() clientData: ClientData,
        @Body() payload: CreateNoteDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.noteService.createPublicNote(
            clientData,
            payload,
            file,
        );
    }

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
    public async getNote(
        @Query() queryParams: GetNoteDataQuery,
    ): Promise<NoteWithUser[]> {
        return await this.noteService.getAllPublicNote(queryParams);
    }
}

export interface NoteWithUser extends Note {
    user?: User;
}
