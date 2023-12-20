import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password: string;
}
