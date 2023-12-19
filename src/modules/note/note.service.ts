import { Injectable } from '@nestjs/common';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { NoteModel } from 'src/models/note.model';
import { CreateNoteDto } from './dto/create-note.dto';
import { post_status } from 'src/commons/role';
import { ObjectId } from 'typeorm';

@Injectable()
export class NoteService {
    constructor(private readonly noteModel: NoteModel) {}

    async getDraftNoteByUserId(clientData: ClientData) {
        const note = await this.noteModel.repository.findOne({
            where: {
                user: {
                    id: clientData.id,
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
                    id: clientData.id,
                },
            },
            order: {
                created_at: 'DESC',
            },
        });

        return note;
    }

    async createDraftNote(clientData: ClientData, payload: CreateNoteDto) {
        let isExistDraft = await this.noteModel.repository.findOne({
            where: {
                user: {
                    id: clientData.id,
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
                    id: clientData.id,
                },
                status: post_status.DRAFT,
            });

        const createResult = await this.noteModel.repository.save({
            ...isExistDraft,
            ...payload,
        });

        return createResult;
    }

    async publicDraftNote(clientData: ClientData) {
        const note = await this.noteModel.repository.findOne({
            where: {
                user: {
                    id: clientData.id,
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
                id: note.id,
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
                id: noteId,
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

    async deleteNote(
        clientData: ClientData,
        noteId: ObjectId,
    ): Promise<boolean> {
        const note = await this.noteModel.repository.findOne({
            where: {
                id: noteId,
                user: {
                    id: clientData.id,
                },
            },
        });

        if (!note) throw new Error('Note not found');

        await this.noteModel.repository.softDelete({
            id: noteId,
        });

        return true;
    }
}
