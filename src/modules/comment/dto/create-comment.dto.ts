import { IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'typeorm';

export class CreateCommentDTO {
    @IsString()
    owner_note_id: ObjectId;

    @IsOptional()
    @IsString()
    parent_id: ObjectId;

    @IsString()
    content: string;
}

export class UpdateCommentDTO {
    @IsString()
    content: string;
}
