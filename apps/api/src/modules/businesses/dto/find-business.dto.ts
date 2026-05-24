import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

export class FindBusinessDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by category UUID' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by city UUID (see GET /cities)' })
  @IsUUID()
  @IsOptional()
  cityId?: string;

  @ApiPropertyOptional({
    description: 'Filter by area UUID (see GET /cities/:id/areas)',
  })
  @IsUUID()
  @IsOptional()
  areaId?: string;
}
