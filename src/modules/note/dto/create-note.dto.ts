import { IsOptional, IsString } from 'class-validator';
import { post_status } from 'src/commons/role';

export class CreateNoteDto {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    status: post_status;
}
