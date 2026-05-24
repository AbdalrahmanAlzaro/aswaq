import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

export class FindCatalogDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by category UUID' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Restrict offers to sellers in this city (UUID; see GET /cities)',
  })
  @IsUUID()
  @IsOptional()
  cityId?: string;
}
