import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  perPage = 20;

  @ApiPropertyOptional({ description: 'Column to sort by (validated against an allow-list)' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @Transform(({ value }) => String(value).toUpperCase())
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'Free-text search' })
  @IsString()
  @IsOptional()
  search?: string;
}

export interface PaginatedMeta {
  page: number;
  perPage: number;
  total: number;
  pageCount: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginatedMeta;
}
