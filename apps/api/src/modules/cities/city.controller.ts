import {
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GenericController } from '../../shared/decorators/generic-controller.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { UserRole } from '../../shared/types/enums';
import { CityService } from './city.service';
import { FindCitiesDto } from './dto/find-cities.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@GenericController('cities', true)
export class CityController {
  constructor(private readonly service: CityService) {}

  // Public list — used by the search city dropdown and the business form.
  @Public()
  @Get()
  findAll(@Query() dto: FindCitiesDto) {
    return this.service.findAll(dto.search);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  // Public dependent dropdown: areas for a city. Returns [] when the city has
  // none seeded yet.
  @Public()
  @Get(':id/areas')
  findAreas(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findAreas(id);
  }

  // --- admin: extend the curated lists -------------------------------------
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  createCity(@Body() dto: CreateCityDto) {
    return this.service.createCity(dto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  updateCity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCityDto,
  ) {
    return this.service.updateCity(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post(':id/areas')
  createArea(
    @Param('id', ParseUUIDPipe) cityId: string,
    @Body() dto: CreateAreaDto,
  ) {
    return this.service.createArea(cityId, dto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':cityId/areas/:areaId')
  updateArea(
    @Param('cityId', ParseUUIDPipe) cityId: string,
    @Param('areaId', ParseUUIDPipe) areaId: string,
    @Body() dto: UpdateAreaDto,
  ) {
    return this.service.updateArea(cityId, areaId, dto);
  }
}
