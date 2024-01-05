import { Injectable } from '@nestjs/common';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { NoteModel } from 'src/models/note.model';
import { CreateNoteDto } from './dto/create-note.dto';
import { post_status } from 'src/commons/role';
import * as mongodb from 'mongodb';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetNoteById, GetNoteDataQuery } from './dto/query-param.dto';
import { UserModel } from 'src/models/user.model';
import { NoteWithUser } from './note.controller';

@Injectable()
export class NoteService {
    constructor(
        private readonly noteModel: NoteModel,
        private readonly cloudinaryService: CloudinaryService,
        private readonly userModel: UserModel,
    ) {}

    async getAllPublicNote(queryParams: GetNoteDataQuery) {
        const { _page, _pageSize } = queryParams;
        const pagination = this.noteModel.getPagination({
            _page,
            _pageSize,
        });

        const [notes, count] = (await this.noteModel.repository.findAndCount({
            where: {
                status: post_status.PUBLIC,
                owner_id: {
                    $ne: null,
                },
            },
            order: {
                created_at: 'DESC',
            },
            ...pagination,
        })) as [NoteWithUser[], number];

        const userIds = notes
            .map((note) => new mongodb.ObjectId(note.owner_id))
            .filter((id) => id !== undefined);

        const users = await this.userModel.repository.find({
            select: ['full_name', 'username'],
            where: {
                _id: {
                    $in: userIds,
                },
            },
        });

        notes.forEach((note) => {
            note.user = users.find((user) => user._id.equals(note.owner_id));
        });

        return {
            notes,
            count,
        };
    }
    async getNoteById(note_id: string, clientData: ClientData) {
        const note = (await this.noteModel.repository.findOne({
            where: {
                _id: new mongodb.ObjectId(note_id),
            },
        })) as NoteWithUser;
        if (!note) throw new Error('Note not found');
        const userInfor = await this.userModel.repository.findOne({
            select: ['full_name', 'username'],
            where: {
                _id: new mongodb.ObjectId(clientData.id),
            },
        });

        note.user = userInfor;

        return note;
    }

    async getDraftNoteByUserId(clientData: ClientData) {
        const note = await this.noteModel.repository.findOne({
            where: {
                owner_id: clientData.id,
                status: post_status.DRAFT,
            },
            order: {
                created_at: 'DESC',
            },
        });
        return note;
    }

    async getNoteByUserId(clientData: ClientData, type: post_status | null) {
        const note = await this.noteModel.repository.find({
            where: {
                owner_id: clientData.id,
                status:
                    type && type.length
                        ? type
                        : { $in: [post_status.PUBLIC, post_status.PRIVATE] },
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
        const uploadResult = file
            ? await this.cloudinaryService.uploadFile(file).then((result) => {
                  return result.secure_url;
              })
            : null;

        let isExistDraft = await this.noteModel.repository.findOne({
            where: {
                owner_id: clientData.id,
                status: post_status.DRAFT,
            },
            order: {
                created_at: 'DESC',
            },
        });

        if (!isExistDraft) {
            isExistDraft = await this.noteModel.repository.save({
                ...payload,
                ...(file ? { image: uploadResult } : {}),
                owner_id: clientData.id,
                status: post_status.DRAFT,
            });
            return isExistDraft;
        }
        const draftNote = await this.noteModel.repository.update(
            {
                _id: isExistDraft._id,
            },
            {
                ...payload,
                ...(file ? { image: uploadResult } : {}),
                owner_id: clientData.id,
                status: post_status.DRAFT,
            },
        );
        return draftNote;
    }

    async updateNote(
        clientData: ClientData,
        noteId: string,
        payload: CreateNoteDto,
        file?: Express.Multer.File,
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

        const uploadResult = file
            ? await this.cloudinaryService.uploadFile(file).then((result) => {
                  return result.secure_url;
              })
            : note.image;

        const updateResult = await this.noteModel.repository.save({
            ...payload,
            image: uploadResult,
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

    async createNote(
        clientData: ClientData,
        payload: CreateNoteDto,
        file?: Express.Multer.File,
    ) {
        const uploadResult = file
            ? await this.cloudinaryService.uploadFile(file).then((result) => {
                  return result.secure_url;
              })
            : null;

        const note = await this.noteModel.repository.save({
            ...payload,
            ...(file ? { image: uploadResult } : {}),
            owner_id: clientData.id,
            status: payload.status,
        });

        const draftNote = await this.noteModel.repository.findOne({
            where: {
                owner_id: clientData.id,
                status: post_status.DRAFT,
            },
            order: {
                created_at: 'DESC',
            },
        });

        if (draftNote) {
            await this.noteModel.repository.delete({
                _id: draftNote._id,
            });
        }

        return note;
    }
}
