import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModel } from 'src/commons/common.model';
import { MongoRepository } from 'typeorm';
import { Comment } from './entities/comment.enity';

@Injectable()
export class CommentModel extends CommonModel {
    constructor(
        @InjectRepository(Comment)
        public repository: MongoRepository<Comment>,
    ) {
        super();
    }
}
