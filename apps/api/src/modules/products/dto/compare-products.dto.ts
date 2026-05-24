import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsUUID } from 'class-validator';

export class CompareProductsDto {
  @ApiProperty({ description: 'Comma-separated product ids, e.g. id1,id2,id3' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((v) => v.trim()).filter(Boolean) : value,
  )
  @IsUUID('4', { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  ids!: string[];
}
