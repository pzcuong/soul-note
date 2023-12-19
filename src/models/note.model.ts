import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModel } from 'src/commons/common.model';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteModel extends CommonModel {
    constructor(
        @InjectRepository(Note)
        public repository: Repository<Note>,
    ) {
        super();
    }
}
