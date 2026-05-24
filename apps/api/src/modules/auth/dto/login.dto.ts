import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @Transform(({ value }) => String(value).toLowerCase().trim())
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}
