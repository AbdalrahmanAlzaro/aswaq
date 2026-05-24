import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCatalogItemDto {
  @ApiProperty()
  @IsString()
  @MaxLength(160)
  name!: string;

  @ApiPropertyOptional({ description: 'Arabic name (optional)' })
  @IsString()
  @MaxLength(160)
  @IsOptional()
  nameAr?: string;

  @ApiProperty({ description: 'Category UUID — see GET /categories' })
  @IsUUID()
  categoryId!: string;

  @ApiProperty({ description: 'Human-readable pack/unit, e.g. "5 kg"' })
  @IsString()
  @MaxLength(60)
  unit!: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(120)
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(500)
  @IsOptional()
  imageUrl?: string;
}
