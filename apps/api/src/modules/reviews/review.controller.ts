import { Body, Get, Post, Query } from '@nestjs/common';
import { GenericController } from '../../shared/decorators/generic-controller.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import { CurrentUser, type AuthUser } from '../../shared/decorators/current-user.decorator';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindReviewsDto } from './dto/find-reviews.dto';

@GenericController('reviews', true)
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  // Paginated reviews. Pass ?businessId= for a shop's reviews or ?productId=
  // for one product's reviews. The DTO requires at least one of the two.
  @Public()
  @Get()
  find(@Query() dto: FindReviewsDto) {
    return this.service.find(dto);
  }

  @Post()
  create(@Body() dto: CreateReviewDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user);
  }
}
