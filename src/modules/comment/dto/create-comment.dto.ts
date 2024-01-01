import { IsString } from 'class-validator';
import { ObjectId } from 'typeorm';

export class CreateCommentDTO {
    @IsString()
    owner_note_id: ObjectId;

    @IsString()
    content: string;
}
