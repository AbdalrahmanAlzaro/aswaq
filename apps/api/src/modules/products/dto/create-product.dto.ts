import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateCatalogItemDto } from '../../catalog/dto/create-catalog-item.dto';

export class CreateProductDto {
  @ApiProperty()
  @IsUUID()
  businessId!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(160)
  name!: string;

  @ApiProperty({ description: 'Price in JD' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  // EITHER `catalogItemId` OR `catalog` — link to an existing CatalogItem,
  // or create one inline so this product becomes its first offer. Leave both
  // unset for a one-off product (e.g. a cafe's signature dish).
  @ApiPropertyOptional({ description: 'Link to an existing catalog item' })
  @IsUUID()
  @IsOptional()
  catalogItemId?: string;

  @ApiPropertyOptional({
    description: 'Create a new catalog item inline. Ignored if catalogItemId is set.',
    type: CreateCatalogItemDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateCatalogItemDto)
  @IsOptional()
  catalog?: CreateCatalogItemDto;
}
