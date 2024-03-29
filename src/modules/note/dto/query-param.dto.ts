import { IsNumberString, IsOptional } from 'class-validator';

export class GetNoteDataQuery {
    @IsNumberString()
    @IsOptional()
    _page?: string;

    @IsNumberString()
    @IsOptional()
    _pageSize?: string;
}

export class GetNoteById {
    @IsNumberString()
    note_id: string;
}
