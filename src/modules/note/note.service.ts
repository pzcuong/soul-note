import { Injectable } from '@nestjs/common';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { NoteModel } from 'src/models/note.model';
import { CreateNoteDto } from './dto/create-note.dto';
import { post_status } from 'src/commons/role';
import { ObjectId } from 'mongodb';
import * as mongodb from 'mongodb';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class NoteService {
    constructor(
        private readonly noteModel: NoteModel,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async getDraftNoteByUserId(clientData: ClientData) {
        const note = await this.noteModel.repository.findOne({
            where: {
                user: {
                    _id: clientData.id,
                },
                status: post_status.DRAFT,
            },
            order: {
                created_at: 'DESC',
            },
        });

        return note;
    }

    async getNoteByUserId(clientData: ClientData) {
        const note = await this.noteModel.repository.find({
            where: {
                user: {
                    _id: clientData.id,
                },
            },
            order: {
                created_at: 'DESC',
            },
        });

        return note;
    }

    async createDraftNote(
        clientData: ClientData,
        payload: CreateNoteDto,
        file?: Express.Multer.File,
    ) {
        let isExistDraft = await this.noteModel.repository.findOne({
            where: {
                user: {
                    _id: clientData.id,
                },
                status: post_status.DRAFT,
            },
            order: {
                created_at: 'DESC',
            },
        });

        if (!isExistDraft)
            isExistDraft = await this.noteModel.repository.save({
                ...payload,
                user: {
                    _id: clientData.id,
                },
                status: post_status.DRAFT,
            });

        const uploadResult = file
            ? await this.cloudinaryService.uploadFile(file).then((result) => {
                  return result.secure_url;
              })
            : isExistDraft.image;

        const createResult = await this.noteModel.repository.save({
            ...isExistDraft,
            ...payload,
            image: uploadResult,
        });

        return createResult;
    }

    async publicDraftNote(clientData: ClientData) {
        const note = await this.noteModel.repository.findOne({
            where: {
                user: {
                    _id: clientData.id,
                },
                status: post_status.DRAFT,
            },
            order: {
                created_at: 'DESC',
            },
        });

        if (!note) throw new Error('Note not found');

        await this.noteModel.repository.update(
            {
                _id: note._id,
            },
            {
                status: post_status.PUBLIC,
            },
        );

        return true;
    }

    async updateNote(
        clientData: ClientData,
        noteId: ObjectId,
        payload: CreateNoteDto,
    ) {
        const note = await this.noteModel.repository.findOne({
            where: {
                _id: new mongodb.ObjectId(noteId),
                user: {
                    id: clientData.id,
                },
            },
        });

        if (!note) throw new Error('Note not found');

        const updateResult = await this.noteModel.repository.save({
            ...payload,
            ...note,
        });

        return updateResult;
    }

    async deleteNote(clientData: ClientData, noteId: string): Promise<boolean> {
        const note = await this.noteModel.repository.findOne({
            where: {
                _id: new mongodb.ObjectId(noteId),
                user: {
                    _id: clientData.id,
                },
            },
        });

        if (!note) throw new Error('Note not found');

        await this.noteModel.repository.delete({
            _id: note._id,
        });

        return true;
    }
}
