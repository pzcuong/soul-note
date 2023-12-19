import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @Length(6, 20, { message: 'Password must be between 8 and 20 characters' })
    password: string;

    @IsString({ message: 'Display name must be a string' })
    @Length(3, 20, {
        message: 'Display name must be between 3 and 20 characters',
    })
    full_name: string;

    @IsString({ message: 'Display name must be a string' })
    @Length(3, 20, {
        message: 'Display name must be between 3 and 20 characters',
    })
    username: string;
}
