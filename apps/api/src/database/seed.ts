/**
 * Aswaq seed script.
 *
 * Inserts a small demo dataset so the UI has content to render: one seed
 * business owner, six businesses across the seeded categories (including
 * `watches` and `jewelry` which gate the Premium luxury-compare flow),
 * 3-4 products per business with JD prices, and a handful of reviews.
 *
 * Idempotent: every row is looked up by a stable natural key (email,
 * business name, business_id + product name, etc.) before insert, so
 * re-running `npm run seed` is a no-op. Categories are NOT inserted —
 * the MarketplaceData migration already seeds them.
 */

import 'reflect-metadata';
import dataSource from '../data-source';
import * as bcrypt from 'bcryptjs';
import { DataSource, EntityManager, IsNull } from 'typeorm';
import { Category } from './entities/category.entity';
import { City } from './entities/city.entity';
import { Area } from './entities/area.entity';
import { User } from './entities/user.entity';
import { Business } from './entities/business.entity';
import { Product } from './entities/product.entity';
import { CatalogItem } from './entities/catalog-item.entity';
import { PriceHistory } from './entities/price-history.entity';
import { Review } from './entities/review.entity';
import { UserRole } from '../shared/types/enums';

const SEED_OWNER_EMAIL = 'seed-owner@aswaq.local';
const SEED_SHOPPERS: { email: string; name: string }[] = [
  { email: 'seed-shopper-1@aswaq.local', name: 'Lina' },
  { email: 'seed-shopper-2@aswaq.local', name: 'Omar' },
  { email: 'seed-shopper-3@aswaq.local', name: 'Sara' },
];

interface ProductSpec {
  name: string;
  price: number;
  description?: string;
  // When set, links this product to the matching CatalogItem (by in-code key
  // below) so it shows up in the cross-market price-comparison flow.
  catalogKey?: string;
}

interface BusinessSpec {
  name: string;
  categorySlug:
    | 'cafe'
    | 'restaurant'
    | 'gym'
    | 'electronics'
    | 'watches'
    | 'jewelry'
    | 'grocery';
  // City + area slugs from the locations seed (migration). These resolve to
  // the real city_id / area_id; the deprecated free-text city/area columns
  // are kept in sync server-side from the looked-up names.
  citySlug: string;
  areaSlug: string;
  description: string;
  phone: string;
  isVerified?: boolean;
  products: ProductSpec[];
  // [authorIdx 0..n-1, rating 1..5, comment, optional productIdx]
  reviews: [number, number, string, number?][];
}

interface CatalogSpec {
  key: string; // stable in-code key (e.g. "rice-5kg") used by ProductSpec.catalogKey
  name: string;
  nameAr: string;
  categorySlug: 'grocery';
  unit: string;
  brand?: string;
}

const CATALOG_ITEMS: CatalogSpec[] = [
  {
    key: 'rice-5kg',
    name: 'Rice 5kg',
    nameAr: 'أرز 5 كغ',
    categorySlug: 'grocery',
    unit: '5 kg',
    brand: 'Abu Kass',
  },
];

const BUSINESSES: BusinessSpec[] = [
  {
    name: 'Beit Sitti Café',
    categorySlug: 'cafe',
    citySlug: 'amman',
    areaSlug: 'amman-jabal-al-weibdeh',
    description: 'Specialty coffee and Levantine breakfasts on a quiet stone street.',
    phone: '+962 6 461 1234',
    isVerified: true,
    products: [
      { name: 'V60 Pour-over', price: 3.5, description: 'Single origin, 250ml' },
      { name: 'Cardamom Latte', price: 4.25 },
      { name: 'Manakish Za`atar', price: 2.75 },
      { name: 'Kunafa Slice', price: 4.5 },
    ],
    reviews: [
      [0, 5, 'Best pour-over in Weibdeh. Cosy stone courtyard too.'],
      [1, 4, 'The kunafa is heavier than I like but very good.'],
      [2, 5, 'My weekly Friday spot.', 1],
    ],
  },
  {
    name: 'Hashem Downtown',
    categorySlug: 'restaurant',
    citySlug: 'amman',
    areaSlug: 'amman-al-balad',
    description: 'Falafel and ful institution downtown since the 1950s.',
    phone: '+962 6 463 6440',
    isVerified: true,
    products: [
      { name: 'Falafel Plate', price: 2.0 },
      { name: 'Ful Mudammas', price: 2.25 },
      { name: 'Hummus with Pine Nuts', price: 3.5 },
      { name: 'Mint Tea', price: 0.75 },
    ],
    reviews: [
      [0, 5, 'Cheap, fast, perfect. A pilgrimage.'],
      [1, 4, 'Crowded at lunch but worth it.'],
    ],
  },
  {
    name: 'Forge Gym Abdoun',
    categorySlug: 'gym',
    citySlug: 'amman',
    areaSlug: 'amman-abdoun',
    description: 'Strength-focused gym with full barbell racks and Olympic platforms.',
    phone: '+962 6 590 0102',
    products: [
      { name: 'Day Pass', price: 12.0 },
      { name: 'Monthly Membership', price: 75.0 },
      { name: 'PT Session (60 min)', price: 30.0 },
    ],
    reviews: [
      [0, 4, 'Excellent equipment, friendly coaches.'],
      [2, 5, 'No-frills, serious gym. Love it.'],
    ],
  },
  {
    name: 'Smart Hub Electronics',
    categorySlug: 'electronics',
    citySlug: 'amman',
    areaSlug: 'amman-shmeisani',
    description: 'Phones, audio, and accessories — official warranties.',
    phone: '+962 6 569 8000',
    isVerified: true,
    products: [
      { name: 'USB-C Fast Charger 65W', price: 19.0 },
      { name: 'Bluetooth Earbuds Pro', price: 89.0 },
      { name: 'Smart Plug (2-pack)', price: 27.5 },
      { name: 'Surge-protected Power Strip', price: 14.0 },
    ],
    reviews: [
      [1, 5, 'Receipt + 2-year warranty, no questions asked. Rare.'],
      [0, 4, 'Earbuds shipped same day.', 1],
    ],
  },
  {
    name: 'Maison Horloge',
    categorySlug: 'watches',
    citySlug: 'amman',
    areaSlug: 'amman-abdali',
    description: 'Boutique watch dealer — automatics, vintage, full service.',
    phone: '+962 6 510 4488',
    isVerified: true,
    products: [
      { name: 'Seiko Presage Cocktail', price: 320.0 },
      { name: 'Tissot PRX Automatic', price: 695.0 },
      { name: 'Hamilton Khaki Field', price: 480.0 },
      { name: 'Service: full automatic overhaul', price: 95.0 },
    ],
    reviews: [
      [2, 5, 'Honest pricing and a careful repair.'],
      [0, 4, 'Took two weeks for a service, fine result.', 3],
    ],
  },
  {
    name: 'Dar Al-Lulu Jewelry',
    categorySlug: 'jewelry',
    citySlug: 'amman',
    areaSlug: 'amman-sweifieh',
    description: '21k and 18k gold, pearls, and custom mounting.',
    phone: '+962 6 585 2200',
    isVerified: true,
    products: [
      { name: '21k Gold Band 4g', price: 285.0 },
      { name: 'Pearl Stud Earrings', price: 120.0 },
      { name: 'Custom Mount (per stone)', price: 45.0 },
      { name: 'Chain Repair', price: 8.5 },
    ],
    reviews: [
      [1, 5, 'Beautiful workmanship on a custom mount.'],
      [2, 5, 'Trusted the family for years.'],
    ],
  },
  // Three grocery shops offering the same catalog item (Rice 5kg) at
  // different prices — the demo dataset for the cross-market price-compare
  // flow. Each shop also has a one-off own-brand product so the catalog
  // page doesn't dominate the seller pages.
  {
    name: 'Carrefour Madinah',
    categorySlug: 'grocery',
    citySlug: 'amman',
    areaSlug: 'amman-madinah-st',
    description: 'Hypermarket — pantry staples, fresh produce, household.',
    phone: '+962 6 553 7777',
    isVerified: true,
    products: [
      { name: 'Rice 5kg', price: 4.75, catalogKey: 'rice-5kg' },
      { name: 'Olive Oil 1L (Carrefour)', price: 6.5 },
    ],
    reviews: [
      [0, 4, 'Best rice price I found this month.', 0],
    ],
  },
  {
    name: 'Sameh Mall Sweifieh',
    categorySlug: 'grocery',
    citySlug: 'amman',
    areaSlug: 'amman-sweifieh',
    description: 'Family supermarket — wide pantry selection, weekly deals.',
    phone: '+962 6 585 1010',
    products: [
      { name: 'Rice 5kg', price: 5.25, catalogKey: 'rice-5kg' },
      { name: 'Fresh Loaf (Sameh bakery)', price: 0.65 },
    ],
    reviews: [
      [1, 4, 'Convenient and clean. Slightly pricier on some staples.'],
    ],
  },
  {
    name: 'Cozmo Market 7th Circle',
    categorySlug: 'grocery',
    citySlug: 'amman',
    areaSlug: 'amman-7th-circle',
    description: 'Upscale grocer — imports, fresh deli, organic shelf.',
    phone: '+962 6 581 3030',
    isVerified: true,
    products: [
      { name: 'Rice 5kg', price: 5.9, catalogKey: 'rice-5kg' },
      { name: 'Imported Pasta 500g', price: 2.1 },
    ],
    reviews: [
      [2, 5, 'My weekly stop. The deli counter is excellent.'],
    ],
  },
];

async function ensureUser(
  manager: EntityManager,
  email: string,
  name: string,
  role: UserRole,
): Promise<User> {
  const existing = await manager.findOne(User, { where: { email } });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash('seed-password', 10);
  return manager.save(
    manager.create(User, { email, name, role, passwordHash }),
  );
}

async function ensureBusiness(
  manager: EntityManager,
  ownerId: string,
  categoryId: string,
  spec: BusinessSpec,
  city: City,
  area: Area,
): Promise<Business> {
  const existing = await manager.findOne(Business, { where: { name: spec.name } });
  if (existing) {
    // Keep mutable fields in sync if the spec changed between runs.
    existing.categoryId = categoryId;
    existing.cityId = city.id;
    existing.areaId = area.id;
    existing.city = city.name; // mirror legacy text columns
    existing.area = area.name;
    existing.description = spec.description;
    existing.phone = spec.phone;
    existing.isVerified = !!spec.isVerified;
    return manager.save(existing);
  }
  return manager.save(
    manager.create(Business, {
      name: spec.name,
      categoryId,
      ownerId,
      cityId: city.id,
      areaId: area.id,
      city: city.name,
      area: area.name,
      description: spec.description,
      phone: spec.phone,
      isVerified: !!spec.isVerified,
    }),
  );
}

async function ensureCatalogItem(
  manager: EntityManager,
  spec: CatalogSpec,
  categoryId: string,
): Promise<CatalogItem> {
  // Natural key: name + unit + brand uniquely identifies a canonical item.
  const existing = await manager.findOne(CatalogItem, {
    where: {
      name: spec.name,
      unit: spec.unit,
      brand: spec.brand ?? IsNull(),
    },
  });
  if (existing) {
    existing.nameAr = spec.nameAr;
    existing.categoryId = categoryId;
    return manager.save(existing);
  }
  return manager.save(
    manager.create(CatalogItem, {
      name: spec.name,
      nameAr: spec.nameAr,
      categoryId,
      unit: spec.unit,
      brand: spec.brand ?? null,
    }),
  );
}

async function ensureProduct(
  manager: EntityManager,
  businessId: string,
  spec: ProductSpec,
  catalogItemId: string | null,
): Promise<Product> {
  const existing = await manager.findOne(Product, {
    where: { businessId, name: spec.name },
  });
  if (existing) {
    const priceChanged = Number(existing.price) !== spec.price;
    existing.price = spec.price;
    existing.catalogItemId = catalogItemId;
    if (spec.description !== undefined) existing.description = spec.description;
    const saved = await manager.save(existing);
    if (priceChanged) {
      await manager.save(
        manager.create(PriceHistory, { productId: saved.id, price: spec.price }),
      );
    }
    return saved;
  }
  const created = await manager.save(
    manager.create(Product, {
      businessId,
      name: spec.name,
      description: spec.description ?? null,
      price: spec.price,
      catalogItemId,
    }),
  );
  await manager.save(
    manager.create(PriceHistory, { productId: created.id, price: spec.price }),
  );
  return created;
}

async function ensureReview(
  manager: EntityManager,
  businessId: string,
  productId: string | null,
  userId: string,
  rating: number,
  comment: string,
): Promise<Review> {
  // Stable natural key: (business, user, comment) — comments here are unique
  // per seed spec, so re-runs match the original row.
  const existing = await manager.findOne(Review, {
    where: { businessId, userId, comment },
  });
  if (existing) {
    existing.rating = rating;
    existing.productId = productId;
    return manager.save(existing);
  }
  return manager.save(
    manager.create(Review, { businessId, productId, userId, rating, comment }),
  );
}

// Recompute denormalised rating_avg / review_count for a row (matches the
// logic in ReviewService.refreshSummary so summary fields don't drift).
async function refreshSummary(
  manager: EntityManager,
  target: typeof Business | typeof Product,
  column: 'businessId' | 'productId',
  id: string,
) {
  const row = await manager
    .createQueryBuilder(Review, 'r')
    .select('AVG(r.rating)', 'avg')
    .addSelect('COUNT(*)', 'count')
    .where(`r.${column} = :id`, { id })
    .getRawOne<{ avg: string | null; count: string }>();
  await manager.update(target, id, {
    ratingAvg: row?.avg ? parseFloat(parseFloat(row.avg).toFixed(2)) : 0,
    reviewCount: row ? parseInt(row.count, 10) : 0,
  });
}

async function seed(ds: DataSource): Promise<void> {
  await ds.transaction(async (manager) => {
    // 1) Resolve seeded categories + cities + areas by slug. All three are
    // owned by migrations; the seed only reads them.
    const categories = await manager.find(Category);
    const bySlug = new Map(categories.map((c) => [c.slug, c]));
    for (const spec of BUSINESSES) {
      if (!bySlug.has(spec.categorySlug)) {
        throw new Error(
          `Category slug '${spec.categorySlug}' not found. Did the MarketplaceData migration run?`,
        );
      }
    }

    const cities = await manager.find(City);
    const cityBySlug = new Map(cities.map((c) => [c.slug, c]));
    const areas = await manager.find(Area);
    const areaBySlug = new Map(areas.map((a) => [a.slug, a]));
    for (const spec of BUSINESSES) {
      if (!cityBySlug.has(spec.citySlug)) {
        throw new Error(
          `City slug '${spec.citySlug}' not found — did the Locations migration run?`,
        );
      }
      if (!areaBySlug.has(spec.areaSlug)) {
        throw new Error(
          `Area slug '${spec.areaSlug}' not found — did the Locations migration run?`,
        );
      }
    }

    // 2) Owner + shopper users.
    const owner = await ensureUser(
      manager,
      SEED_OWNER_EMAIL,
      'Aswaq Seed Owner',
      UserRole.BUSINESS,
    );
    const shoppers: User[] = [];
    for (const s of SEED_SHOPPERS) {
      shoppers.push(await ensureUser(manager, s.email, s.name, UserRole.SHOPPER));
    }

    // 3) Canonical catalog items (cross-market price comparison source).
    const catalogByKey = new Map<string, CatalogItem>();
    for (const c of CATALOG_ITEMS) {
      const cat = bySlug.get(c.categorySlug);
      if (!cat) {
        throw new Error(
          `Catalog category slug '${c.categorySlug}' not found — did the Catalog migration run?`,
        );
      }
      catalogByKey.set(c.key, await ensureCatalogItem(manager, c, cat.id));
    }

    // 4) Businesses + products + reviews.
    let bizCount = 0;
    let productCount = 0;
    let reviewCount = 0;
    for (const spec of BUSINESSES) {
      const cat = bySlug.get(spec.categorySlug)!;
      const city = cityBySlug.get(spec.citySlug)!;
      const area = areaBySlug.get(spec.areaSlug)!;
      const business = await ensureBusiness(
        manager,
        owner.id,
        cat.id,
        spec,
        city,
        area,
      );
      bizCount++;

      const products: Product[] = [];
      for (const p of spec.products) {
        const catalogItemId = p.catalogKey
          ? catalogByKey.get(p.catalogKey)?.id ?? null
          : null;
        products.push(await ensureProduct(manager, business.id, p, catalogItemId));
        productCount++;
      }

      for (const [authorIdx, rating, comment, productIdx] of spec.reviews) {
        const author = shoppers[authorIdx % shoppers.length];
        const product = productIdx !== undefined ? products[productIdx] ?? null : null;
        await ensureReview(
          manager,
          business.id,
          product ? product.id : null,
          author.id,
          rating,
          comment,
        );
        reviewCount++;
      }

      await refreshSummary(manager, Business, 'businessId', business.id);
      for (const product of products) {
        if (await manager.count(Review, { where: { productId: product.id } })) {
          await refreshSummary(manager, Product, 'productId', product.id);
        }
      }
    }

    console.log(
      `Seed complete: ${bizCount} businesses, ${productCount} products, ${reviewCount} reviews, ${shoppers.length} shoppers, 1 owner, ${catalogByKey.size} catalog items.`,
    );
  });
}

async function main() {
  const ds = await dataSource.initialize();
  try {
    await seed(ds);
  } finally {
    await ds.destroy();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
