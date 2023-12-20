import { CommonEntity } from 'src/commons/entities';
import { user_role } from 'src/commons/role';
import { Column, Entity, OneToMany } from 'typeorm';
import { Note } from './note.entity';
import { UserFavouriteNote } from './user-favourite-note.entity';

@Entity({ name: 'user' })
export class User extends CommonEntity {
    @Column({ name: 'full_name', type: 'string', length: 50 })
    full_name: string;

    @Column({ name: 'username', type: 'string', length: 50, unique: true })
    username: string;

    @Column({ name: 'email', type: 'string', length: 50, unique: true })
    email: string;

    @Column({ name: 'password', type: 'string' })
    password: string;

    @Column({ name: 'role', type: 'string', enum: user_role })
    role: string;

    @Column({ name: 'date_of_birth', type: 'date' })
    date_of_birth: Date;

    @OneToMany(() => Note, (note) => note.user)
    note: Note[];

    @OneToMany(
        () => UserFavouriteNote,
        (user_favourite_note) => user_favourite_note.user,
    )
    user_favourite_note: UserFavouriteNote[];
}
