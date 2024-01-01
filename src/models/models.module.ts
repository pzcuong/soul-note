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

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Note, UserFavouriteNote, Comment]),
    ],
    providers: [UserModel, NoteModel, UserFavouriteNoteModel, CommentModel],
    exports: [UserModel, NoteModel, UserFavouriteNoteModel, CommentModel],
})
export class ModelsModule {}
