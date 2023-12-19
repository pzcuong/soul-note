import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModel } from 'src/commons/common.model';
import { MongoRepository } from 'typeorm';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteModel extends CommonModel {
    constructor(
        @InjectRepository(Note)
        public repository: MongoRepository<Note>,
    ) {
        super();
    }
}
