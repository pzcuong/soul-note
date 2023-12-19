import { Module } from '@nestjs/common';
import { UserModel } from './user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NoteModel } from './note.model';
import { Note } from './entities/note.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Note])],
    providers: [UserModel, NoteModel],
    exports: [UserModel, NoteModel],
})
export class ModelsModule {}
