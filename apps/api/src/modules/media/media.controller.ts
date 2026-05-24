import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { GenericController } from '../../shared/decorators/generic-controller.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import { CurrentUser, type AuthUser } from '../../shared/decorators/current-user.decorator';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FindMediaDto } from './dto/find-media.dto';
import { ReorderMediaDto } from './dto/reorder-media.dto';

@GenericController('media', true)
export class MediaController {
  constructor(private readonly service: MediaService) {}

  @Public()
  @Get()
  findForOwner(@Query() dto: FindMediaDto) {
    return this.service.findForOwner(dto.ownerType, dto.ownerId);
  }

  // attach a new media row (URL only — no upload here)
  @Post()
  create(@Body() dto: CreateMediaDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user);
  }

  // bulk reorder rows for a single parent
  @Patch('reorder')
  reorder(@Body() dto: ReorderMediaDto, @CurrentUser() user: AuthUser) {
    return this.service.reorder(dto, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMediaDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.service.remove(id, user);
  }
}
