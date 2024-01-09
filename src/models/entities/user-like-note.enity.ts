import { ObjectId } from 'mongodb';
import { CommonEntity } from 'src/commons/entities';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user_like_note' })
export class UserLikeNote extends CommonEntity {
    @Column({ type: 'string' })
    user_id: ObjectId;

    @Column({ type: 'string' })
    note_id: ObjectId;
}
