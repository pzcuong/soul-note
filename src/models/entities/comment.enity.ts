import { CommonEntity } from 'src/commons/entities';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'comment' })
export class Comment extends CommonEntity {
    @Column({ name: 'owner_note_id', type: 'string' })
    owner_note_id: ObjectId;

    @Column({ name: 'content', type: 'string' })
    content: string;

    @Column({ name: 'owner_user_id', type: 'string' })
    owner_user_id: ObjectId;

    @Column({ type: 'array' })
    children: CommentReply[];
}

@Entity({ name: 'comment_reply' })
export class CommentReply extends CommonEntity {
    @Column({ type: 'string' })
    owner_comment_id: string;

    @Column({ type: 'string' })
    owner_user_id: ObjectId;

    @Column({ type: 'string' })
    content: string;

    @Column({ type: 'string', nullable: true })
    reply_user_id: ObjectId | null;
}
