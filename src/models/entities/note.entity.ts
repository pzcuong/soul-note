import { CommonEntity } from 'src/commons/entities';
import { post_status } from 'src/commons/role';
import { Column, Entity, ManyToOne, ObjectId } from 'typeorm';
import { UserFavouriteNote } from './user-favourite-note.entity';

@Entity({ name: 'note' })
export class Note extends CommonEntity {
    @Column({ name: 'title', type: 'string', nullable: true })
    title: string;

    @Column({ name: 'content', type: 'string' })
    content: string;

    @Column({ name: 'image', type: 'string', array: true, nullable: true })
    image: string[];

    @Column({
        name: 'status',
        type: 'string',
        enum: post_status,
        default: post_status.DRAFT,
    })
    status: post_status;

    @Column({ type: 'string' })
    owner_id: ObjectId;

    @ManyToOne(
        () => UserFavouriteNote,
        (user_favourite_note) => user_favourite_note.note,
    )
    user_favourite_note: UserFavouriteNote;
}
