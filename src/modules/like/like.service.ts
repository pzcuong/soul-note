import { HttpException, Injectable } from '@nestjs/common';
import { NoteModel } from 'src/models/note.model';
import * as mongodb from 'mongodb';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { UserLikeNoteModel } from 'src/models/user-like-note.model';

@Injectable()
export class LikeService {
    constructor(
        private readonly likeNoteModel: UserLikeNoteModel,
        private readonly noteModel: NoteModel,
    ) {}

    async getLikeNoteByUserId(clientData: ClientData) {
        const likeNotes = await this.likeNoteModel.repository.find({
            where: {
                user: {
                    _id: clientData.id,
                },
            },
        });

        const noteIds = likeNotes.map((likeNote) => likeNote.note._id);

        const notes = await this.noteModel.repository.find({
            where: {
                _id: {
                    $in: noteIds,
                },
            },
        });

        return notes;
    }

    async handleLike(clientData: ClientData, noteId: string) {
        const note = await this.noteModel.repository.findOne({
            where: {
                _id: new mongodb.ObjectId(noteId),
            },
        });
        if (!note) throw new HttpException('Note not found', 404);

        const likeNote = await this.likeNoteModel.repository.findOne({
            where: {
                user: {
                    _id: clientData.id,
                },
                note: {
                    _id: note._id,
                },
            },
        });

        if (likeNote) {
            await this.likeNoteModel.repository.delete({
                _id: likeNote._id,
            });
            throw new HttpException('Unlike success', 200);
        }

        await this.likeNoteModel.repository.save({
            user: {
                _id: clientData.id,
            },
            note: {
                _id: new mongodb.ObjectId(noteId),
            },
        });

        throw new HttpException('Like success', 200);
    }
}
