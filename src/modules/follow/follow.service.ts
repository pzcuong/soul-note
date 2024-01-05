import { HttpException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ClientData } from 'src/decorators/get_current_user.decorator';
import { UserModel } from 'src/models/user.model';
import { GetNoteDataQuery } from '../note/dto/query-param.dto';
import { NoteModel } from 'src/models/note.model';
import * as mongodb from 'mongodb';
import { post_status } from 'src/commons/role';
import { NoteWithUser } from '../note/note.controller';

@Injectable()
export class FollowService {
    constructor(
        private readonly userModel: UserModel,
        private readonly noteModel: NoteModel,
    ) {}

    async followUser(clientData: ClientData, follow_id: string) {
        const user = await this.userModel.repository.findOne({
            where: { _id: new ObjectId(clientData.id) },
        });

        const followedUser = await this.userModel.repository.findOne({
            where: { _id: new ObjectId(follow_id) },
        });

        if (!followedUser || clientData.id === followedUser._id)
            throw new HttpException('User not found', 404);

        if (!user.follows) user.follows = [];

        const isFollowed = user?.follows.find(
            (follow) => follow.toString() == follow_id,
        );

        if (isFollowed) {
            user.follows = user.follows.filter(
                (follow) => follow.toString() != follow_id,
            );
            await this.userModel.repository.save(user);
            return { message: 'Unfollowed user successfully', data: user };
        }

        user?.follows.push(new ObjectId(follow_id));
        await this.userModel.repository.save(user);
        return { message: 'Followed user successfully', data: user };
    }

    async getNoteByFollow(
        clientData: ClientData,
        queryParams: GetNoteDataQuery,
    ) {
        const { _page, _pageSize } = queryParams;
        const pagination = this.noteModel.getPagination({
            _page,
            _pageSize,
        });

        const userData = await this.userModel.repository.findOne({
            where: {
                _id: new mongodb.ObjectId(clientData.id),
            },
        });

        const [notes, count] = (await this.noteModel.repository.findAndCount({
            where: {
                status: post_status.PUBLIC,
                owner_id: {
                    $in: userData?.follows.toString().split(','),
                },
            },
            order: {
                created_at: 'DESC',
            },
            ...pagination,
        })) as [NoteWithUser[], number];

        const userIds = notes
            .map((note) => new mongodb.ObjectId(note.owner_id))
            .filter((id) => id !== undefined);

        const users = await this.userModel.repository.find({
            select: ['full_name', 'username'],
            where: {
                _id: {
                    $in: userIds,
                },
            },
        });

        notes.forEach((note) => {
            note.user = users.find((user) => user._id.equals(note.owner_id));
        });

        return {
            notes,
            count,
        };
    }
}
