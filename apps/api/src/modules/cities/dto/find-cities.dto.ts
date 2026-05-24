import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindCitiesDto {
  @ApiPropertyOptional({
    description: 'Case-insensitive name/nameAr match (partial)',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
