import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateMediaDto } from './create-media.dto';

// owner_type and owner_id pin the row to its parent — they can't be changed after creation.
export class UpdateMediaDto extends PartialType(
  OmitType(CreateMediaDto, ['ownerType', 'ownerId'] as const),
) {}
