import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { CreateCommentDTO, UpdateCommentDTO } from './dto/create-comment.dto';
import { CommentModel } from 'src/models/comment.model';
import { CommentWithReplies } from './comment.controller';
import { UserModel } from 'src/models/user.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentModel: CommentModel,
        private readonly userModel: UserModel,
    ) {}

    async createComment(clientData: ClientData, payload: CreateCommentDTO) {
        return await this.commentModel.repository.save({
            ...payload,
            owner_user_id: clientData.id,
        });
    }

    async getCommentsByNoteId(note_id: string) {
        const comments = (await this.commentModel.repository.find({
            where: {
                owner_note_id: note_id,
            },
        })) as CommentWithReplies[];

        const commentsWithUser = [];

        for (const comment of comments) {
            const user = await this.userModel.repository.findOne({
                where: {
                    _id: new ObjectId(comment.owner_user_id),
                },
            });
            commentsWithUser.push({
                ...comment,
                user: {
                    _id: user._id,
                    full_name: user.full_name,
                    username: user.username,
                    email: user.email,
                },
            });
        }
        const rootComments = commentsWithUser.filter(
            (comment) => !comment.parent_id,
        );
        const replies = commentsWithUser.filter((comment) => comment.parent_id);

        rootComments.forEach((rootComment) => {
            rootComment.replies = replies.filter(
                (reply) => reply.parent_id == rootComment._id,
            );
        });
        return rootComments;
    }

    async deleteComment(clientData: ClientData, comment_id: string) {
        const comment = await this.commentModel.repository.findOne({
            where: {
                _id: new ObjectId(comment_id),
                owner_user_id: clientData.id,
            },
        });

        if (!comment)
            throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

        return await this.commentModel.repository.delete({
            _id: new ObjectId(comment_id),
        });
    }

    async updateComment(
        clientData: ClientData,
        comment_id: string,
        payload: UpdateCommentDTO,
    ) {
        const comment = await this.commentModel.repository.findOne({
            where: {
                _id: new ObjectId(comment_id),
                owner_user_id: clientData.id,
            },
        });

        if (!comment)
            throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

        return await this.commentModel.repository.update(
            {
                _id: new ObjectId(comment_id),
            },
            payload,
        );
    }
}
