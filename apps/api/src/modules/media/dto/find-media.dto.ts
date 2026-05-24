import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { MediaOwnerType } from '../../../shared/types/enums';

export class FindMediaDto {
  @ApiProperty({ enum: MediaOwnerType })
  @IsEnum(MediaOwnerType)
  ownerType!: MediaOwnerType;

  @ApiProperty()
  @IsUUID()
  ownerId!: string;
}
