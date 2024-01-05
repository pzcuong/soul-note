import { Module } from '@nestjs/common';
import { UserModel } from './user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NoteModel } from './note.model';
import { Note } from './entities/note.entity';
import { UserFavouriteNoteModel } from './user-favourite-note.model';
import { UserFavouriteNote } from './entities/user-favourite-note.entity';
import { CommentModel } from './comment.model';
import { Comment } from './entities/comment.enity';
import { UserLikeNoteModel } from './user-like-note.model';
import { UserLikeNote } from './entities/user-like-note.enity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Note,
            UserFavouriteNote,
            Comment,
            UserLikeNote,
        ]),
    ],
    providers: [
        UserModel,
        NoteModel,
        UserFavouriteNoteModel,
        CommentModel,
        UserLikeNoteModel,
    ],
    exports: [
        UserModel,
        NoteModel,
        UserFavouriteNoteModel,
        CommentModel,
        UserLikeNoteModel,
    ],
})
export class ModelsModule {}
