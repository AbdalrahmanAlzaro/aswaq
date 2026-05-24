import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { MediaKind, MediaOwnerType } from '../../../shared/types/enums';

export class CreateMediaDto {
  @ApiProperty({ enum: MediaOwnerType })
  @IsEnum(MediaOwnerType)
  ownerType!: MediaOwnerType;

  @ApiProperty({ description: 'UUID of the business/product/review to attach the media to' })
  @IsUUID()
  ownerId!: string;

  @ApiProperty({ description: 'Public URL of the asset (we only store the URL)' })
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  url!: string;

  @ApiPropertyOptional({ enum: MediaKind, default: MediaKind.GALLERY })
  @IsEnum(MediaKind)
  @IsOptional()
  kind?: MediaKind;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  @IsOptional()
  altText?: string;
}
