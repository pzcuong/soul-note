import { CommonEntity } from 'src/commons/entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Note } from './note.entity';
import { ObjectId } from 'mongodb';

@Entity({ name: 'user_favourite_note' })
export class UserFavouriteNote extends CommonEntity {
    @Column((type) => User)
    user: User;

    @Column((type) => Note)
    note: Note;
}
