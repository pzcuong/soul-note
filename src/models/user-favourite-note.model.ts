import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModel } from 'src/commons/common.model';
import { MongoRepository } from 'typeorm';
import { UserFavouriteNote } from './entities/user-favourite-note.entity';

@Injectable()
export class UserFavouriteNoteModel extends CommonModel {
    constructor(
        @InjectRepository(UserFavouriteNote)
        public repository: MongoRepository<UserFavouriteNote>,
    ) {
        super();
    }
}
