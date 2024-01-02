import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModel } from 'src/commons/common.model';
import { MongoRepository } from 'typeorm';
import { UserLikeNote } from './entities/user-like-note.enity';

@Injectable()
export class UserLikeNoteModel extends CommonModel {
    constructor(
        @InjectRepository(UserLikeNote)
        public repository: MongoRepository<UserLikeNote>,
    ) {
        super();
    }
}
