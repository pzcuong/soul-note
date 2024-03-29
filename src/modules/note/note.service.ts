import { Injectable } from '@nestjs/common';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { NoteModel } from 'src/models/note.model';
import { CreateNoteDto } from './dto/create-note.dto';
import { post_status } from 'src/commons/role';
import * as mongodb from 'mongodb';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetNoteDataQuery } from './dto/query-param.dto';
import { UserModel } from 'src/models/user.model';
import { NoteWithUser } from './note.controller';
import { UserLikeNoteModel } from 'src/models/user-like-note.model';
import { CommentModel } from 'src/models/comment.model';
import { UserFavouriteNoteModel } from 'src/models/user-favourite-note.model';

@Injectable()
export class NoteService {
    constructor(
        private readonly noteModel: NoteModel,
        private readonly cloudinaryService: CloudinaryService,
        private readonly userModel: UserModel,
        private readonly likeModel: UserLikeNoteModel,
        private readonly commentModel: CommentModel,
        private readonly favouriteModel: UserFavouriteNoteModel,
    ) {}

    async getDetailNote(notes: NoteWithUser[], clientData: ClientData) {
        const likeStatus = await this.likeModel.repository.find({
            where: {
                note_id: {
                    $in: notes.map((note) => new mongodb.ObjectId(note._id)),
                },
            },
        });

        notes.forEach((note) => {
            note.likeCount = likeStatus.filter((like) =>
                like.note_id.equals(note._id),
            ).length;
            note.isLike = likeStatus.some(
                (like) =>
                    like.user_id === clientData.id &&
                    like.note_id.equals(note._id),
            );
        });

        const commentStatus = await this.commentModel.repository.find({
            where: {
                owner_note_id: {
                    $in: notes.map((note) => note._id.toString()),
                },
            },
        });

        notes.forEach((note) => {
            note.commentCount = commentStatus.filter(
                (comment) => comment.owner_note_id == note._id,
            ).length;
        });

        const favouriteStatus = await this.favouriteModel.repository.find({
            where: {
                'note._id': {
                    $in: notes.map((note) => new mongodb.ObjectId(note._id)),
                },
            },
        });

        notes.forEach((note) => {
            note.isFavourite = favouriteStatus.some(
                (favourite) =>
                    favourite.user._id === clientData.id &&
                    favourite.note._id.equals(note._id),
            );
        });

        return notes;
    }

    async getAllPublicNote(
        queryParams: GetNoteDataQuery,
        clientData: ClientData,
    ) {
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

        await this.getDetailNote(notes, clientData);

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
                _id: new mongodb.ObjectId(note.owner_id),
            },
        });

        note.user = userInfor;
        await this.getDetailNote([note], clientData);

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

    async getNoteByUserId(
        queryParams: GetNoteDataQuery,
        clientData: ClientData,
        type: post_status | null,
    ) {
        const { _page, _pageSize } = queryParams;
        const pagination = this.noteModel.getPagination({
            _page,
            _pageSize,
        });

        const [notes, count] = await this.noteModel.repository.findAndCount({
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
            ...pagination,
        });

        await this.getDetailNote(notes, clientData);

        return {
            notes,
            count,
        };
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
                owner_id: clientData.id,
            },
        });

        if (!note) throw new Error('Note not found');

        const uploadResult = file
            ? await this.cloudinaryService.uploadFile(file).then((result) => {
                  return result.secure_url;
              })
            : note.image;

        const updateResult = await this.noteModel.repository.save({
            ...note,
            ...payload,
            image: uploadResult,
        });

        return updateResult;
    }

    async deleteNote(clientData: ClientData, noteId: string): Promise<boolean> {
        const note = await this.noteModel.repository.findOne({
            where: {
                _id: new mongodb.ObjectId(noteId),
                owner_id: clientData.id,
            },
        });

        if (!note) throw new Error('Note not found');

        note.image && (await this.cloudinaryService.deleteFile(note.image));

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

        const draftNote = await this.noteModel.repository.findOne({
            where: {
                owner_id: clientData.id,
                status: post_status.DRAFT,
            },
            order: {
                created_at: 'DESC',
            },
        });

        return await this.noteModel.repository.save({
            ...draftNote,
            ...payload,
            ...(file ? { image: uploadResult } : {}),
            owner_id: clientData.id,
            status: payload.status,
        });
    }
}
