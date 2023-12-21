import { HttpException, Injectable } from '@nestjs/common';
import { NoteModel } from 'src/models/note.model';
import { UserFavouriteNoteModel } from 'src/models/user-favourite-note.model';
import * as mongodb from 'mongodb';
import { ClientData } from 'src/decorators/get_current_user.decorator';

@Injectable()
export class FavouriteService {
    constructor(
        private readonly favouriteNoteModel: UserFavouriteNoteModel,
        private readonly noteModel: NoteModel,
    ) {}

    async getFavouriteNoteByUserId(clientData: ClientData) {
        const favouriteNotes = await this.favouriteNoteModel.repository.find({
            where: {
                user: {
                    _id: clientData.id,
                },
            },
        });

        const noteIds = favouriteNotes.map(
            (favouriteNote) => favouriteNote.note._id,
        );

        const notes = await this.noteModel.repository.find({
            where: {
                _id: {
                    $in: noteIds,
                },
            },
        });

        return notes;
    }

    async addFavouriteNoteByUserId(clientData: ClientData, noteId: string) {
        const note = await this.noteModel.repository.findOne({
            where: {
                _id: new mongodb.ObjectId(noteId),
            },
        });

        if (!note) throw new HttpException('Note not found', 404);

        const favouriteNote = await this.favouriteNoteModel.repository.findOne({
            where: {
                user: {
                    _id: clientData.id,
                },
                note: {
                    _id: note._id,
                },
            },
        });

        if (favouriteNote)
            throw new HttpException('Note already in favourite list', 400);

        await this.favouriteNoteModel.repository.save({
            user: {
                _id: clientData.id,
            },
            note: {
                _id: new mongodb.ObjectId(noteId),
            },
        });

        return note;
    }

    async removeFavouriteNoteByUserId(clientData: ClientData, noteId: string) {
        const note = await this.noteModel.repository.findOne({
            where: {
                _id: new mongodb.ObjectId(noteId),
            },
        });

        if (!note) throw new HttpException('Note not found', 404);

        const favouriteNote = await this.favouriteNoteModel.repository.findOne({
            where: {
                user: {
                    _id: clientData.id,
                },
                note: {
                    _id: note._id,
                },
            },
        });

        if (!favouriteNote)
            throw new HttpException('Note not in favourite list', 400);

        await this.favouriteNoteModel.repository.delete({
            _id: favouriteNote._id,
        });

        return note;
    }
}
