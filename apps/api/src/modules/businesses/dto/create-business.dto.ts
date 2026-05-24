import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty()
  @IsString()
  @MaxLength(160)
  name!: string;

  @ApiProperty({ description: 'Category UUID — see GET /categories' })
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({ description: 'City UUID — see GET /cities' })
  @IsUUID()
  @IsOptional()
  cityId?: string;

  @ApiPropertyOptional({
    description: 'Area UUID — see GET /cities/:id/areas',
  })
  @IsUUID()
  @IsOptional()
  areaId?: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(32)
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(500)
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(500)
  @IsOptional()
  coverUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
