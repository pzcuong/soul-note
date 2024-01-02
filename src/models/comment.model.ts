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

// export class CommentReplyModel extends CommonModel {
//     constructor(
//         @InjectRepository(CommentReply)
//         public repository: MongoRepository<CommentReply>,
//     ) {
//         super();
//     }
// }
