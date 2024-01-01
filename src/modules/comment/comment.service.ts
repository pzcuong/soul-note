import { Injectable } from '@nestjs/common';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { CommentModel } from 'src/models/comment.model';
import { GetCommentDataQuery } from './dto/query-param.dto';
import { UserModel } from 'src/models/user.model';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentModel: CommentModel,
        private readonly userModel: UserModel,
    ) {}
    async createComment(clientData: ClientData, payload: CreateCommentDTO) {
        const comment = await this.commentModel.repository.save({
            ...payload,
            owner_user_id: clientData.id,
            children: [],
        });

        return comment;
    }
}
