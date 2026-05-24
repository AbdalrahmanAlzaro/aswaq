import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { PaymentPurpose, PaymentStatus } from '../../../shared/types/enums';

export class FindPaymentsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PaymentPurpose })
  @IsEnum(PaymentPurpose)
  @IsOptional()
  purpose?: PaymentPurpose;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}
