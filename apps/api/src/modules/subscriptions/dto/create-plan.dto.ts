import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { SubscriptionTier } from '../../../shared/types/enums';

export class CreatePlanDto {
  @ApiProperty()
  @IsString()
  @MaxLength(80)
  @Matches(/^[a-z0-9-]+$/)
  slug!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ enum: SubscriptionTier })
  @IsEnum(SubscriptionTier)
  tier!: SubscriptionTier;

  @ApiProperty({ description: 'Price in JD' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @ApiProperty({ description: 'Billing cycle length in days' })
  @IsInt()
  @Min(1)
  periodDays!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
