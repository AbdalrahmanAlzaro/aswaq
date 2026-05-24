import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { OrderStatus } from '../../../shared/types/enums';

export class FindOrdersDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Owner/admin only — scope to one business' })
  @IsUUID()
  @IsOptional()
  businessId?: string;

  @ApiPropertyOptional({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
