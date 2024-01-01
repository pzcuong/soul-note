import { IsNumberString, IsOptional } from 'class-validator';

export class GetCommentDataQuery {
    @IsNumberString()
    @IsOptional()
    _page?: string;

    @IsNumberString()
    @IsOptional()
    _pageSize?: string;
}
