import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, ValidateIf } from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

// At least one of (businessId, productId) must be provided. The ValidateIf
// pair forces UUID validation on whichever field is present and 422s the
// request if neither is set. When both are set, the service prefers
// productId (the more specific filter).
export class FindReviewsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by business UUID' })
  @ValidateIf((o: FindReviewsDto) => !o.productId)
  @IsUUID()
  businessId?: string;

  @ApiPropertyOptional({ description: 'Filter by product UUID' })
  @ValidateIf((o: FindReviewsDto) => !o.businessId)
  @IsUUID()
  productId?: string;
}
