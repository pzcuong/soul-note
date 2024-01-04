import { CommonEntity } from 'src/commons/entities';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity({ name: 'comment' })
export class Comment extends CommonEntity {
    @Column({ name: 'owner_note_id', type: 'string' })
    owner_note_id: ObjectId;

    @Column({ name: 'content', type: 'string' })
    content: string;

    @Column({ name: 'owner_user_id', type: 'string' })
    owner_user_id: ObjectId;

    @Column({ name: 'parent_id', type: 'string', nullable: true })
    parent_id?: ObjectId;

    @Column({ name: 'tag_user_id', type: 'string', nullable: true })
    tag_user_id?: ObjectId;
}
