import { CommonEntity } from 'src/commons/entities';
import { Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Note } from './note.entity';

@Entity({ name: 'user_favourite_note' })
export class UserFavouriteNote extends CommonEntity {
    @ManyToOne(() => User, (user) => user.user_favourite_note)
    user: User;

    @ManyToOne(() => Note, (note) => note.user_favourite_note)
    note: Note;
}
