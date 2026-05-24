import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { PaymentPurpose } from '../../../shared/types/enums';

export class CreatePaymentDto {
  @ApiProperty({ enum: PaymentPurpose })
  @IsEnum(PaymentPurpose)
  purpose!: PaymentPurpose;

  @ApiProperty({ description: 'Amount in JD' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount!: number;

  @ApiPropertyOptional({ description: 'Required when purpose=ORDER' })
  @ValidateIf((o) => o.purpose === PaymentPurpose.ORDER)
  @IsUUID()
  orderId?: string;

  @ApiPropertyOptional({ description: 'Required when purpose=BUSINESS_SUBSCRIPTION' })
  @ValidateIf((o) => o.purpose === PaymentPurpose.BUSINESS_SUBSCRIPTION)
  @IsUUID()
  businessSubscriptionId?: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  @IsOptional()
  providerRef?: string;
}
