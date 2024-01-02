import { CommonEntity } from 'src/commons/entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Note } from './note.entity';

@Entity({ name: 'user_like_note' })
export class UserLikeNote extends CommonEntity {
    @Column((type) => User)
    user: User;

    @Column((type) => Note)
    note: Note;
}
