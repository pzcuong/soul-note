import {
    CreateDateColumn,
    DeleteDateColumn,
    ObjectIdColumn,
    UpdateDateColumn,
    ObjectId,
} from 'typeorm';

export class CommonEntity {
    @ObjectIdColumn()
    id: ObjectId;

    @CreateDateColumn({ name: 'created_at' })
    created_at?: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        nullable: true,
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at?: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deleted_at?: Date;
}
