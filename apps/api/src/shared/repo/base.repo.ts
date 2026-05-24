import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { Paginated, PaginationDto } from '../dto/pagination.dto';

export interface PaginateOptions {
  /** root alias used in the query builder, e.g. 'b' */
  alias: string;
  /** aliased columns the free-text `search` runs against, e.g. ['b.name', 'b.area'] */
  searchable?: string[];
  /** columns allowed in `sortBy` — NEVER interpolate user input as SQL without this */
  allowedSort: string[];
  /** fallback sort column when sortBy is absent/invalid */
  defaultSort: string;
}

/**
 * Shared list/pagination logic (mirrors Safeer's BaseRepository, trimmed and fixed):
 *  - no injected deps, so services that extend it stay singletons (fixes request-scope contagion)
 *  - `sortBy` is validated against an allow-list (fixes SQL identifier injection)
 *  - search params use a counter, not Date.now() (fixes param-key collisions)
 */
export abstract class BaseRepository {
  protected async paginate<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    dto: PaginationDto,
    opts: PaginateOptions,
  ): Promise<Paginated<T>> {
    // free-text search across the allowed columns
    if (dto.search && opts.searchable?.length) {
      const term = `%${dto.search}%`;
      qb.andWhere(
        `(${opts.searchable.map((c, i) => `${c} ILIKE :search_${i}`).join(' OR ')})`,
        Object.fromEntries(opts.searchable.map((_, i) => [`search_${i}`, term])),
      );
    }

    // sort: only allow known columns
    const sortBy =
      dto.sortBy && opts.allowedSort.includes(dto.sortBy) ? dto.sortBy : opts.defaultSort;
    qb.orderBy(`${opts.alias}.${sortBy}`, dto.sortOrder);

    // page
    const page = dto.page ?? 1;
    const perPage = dto.perPage ?? 20;
    qb.skip((page - 1) * perPage).take(perPage);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      meta: { page, perPage, total, pageCount: Math.ceil(total / perPage) || 1 },
    };
  }
}
