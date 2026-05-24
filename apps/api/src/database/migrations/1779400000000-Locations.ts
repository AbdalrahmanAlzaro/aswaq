import { MigrationInterface, QueryRunner } from 'typeorm';

// Normalise locations into two reference tables and wire businesses to them.
//   - cities             (curated; admin-extendable)
//   - areas              (places inside a city; city_id, no FK)
//   - businesses.city_id + area_id (nullable, no FK)
// Same conventions as the prior migrations: idempotent (IF NOT EXISTS,
// ON CONFLICT (slug) DO NOTHING), no FK constraints, indexes on every *_id.
//
// Seeded with the starter set the product brief listed; best-effort backfill
// matches the existing free-text business.city / business.area columns to the
// seeded rows. Old text columns are kept during transition.
export class Locations1779400000000 implements MigrationInterface {
  public async up(qr: QueryRunner): Promise<void> {
    // --- cities -------------------------------------------------------------
    await qr.query(`
      CREATE TABLE IF NOT EXISTS "cities" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "slug" varchar(80) NOT NULL,
        "name" varchar(120) NOT NULL,
        "name_ar" varchar(120) NOT NULL,
        "governorate" varchar(120),
        "latitude" numeric(9,6),
        "longitude" numeric(9,6),
        "sort_order" int NOT NULL DEFAULT 0,
        "is_active" boolean NOT NULL DEFAULT true
      );
    `);
    await qr.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "idx_cities_slug" ON "cities" ("slug");`,
    );

    // --- areas --------------------------------------------------------------
    await qr.query(`
      CREATE TABLE IF NOT EXISTS "areas" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "city_id" uuid NOT NULL,
        "slug" varchar(100) NOT NULL,
        "name" varchar(120) NOT NULL,
        "name_ar" varchar(120) NOT NULL,
        "latitude" numeric(9,6),
        "longitude" numeric(9,6),
        "sort_order" int NOT NULL DEFAULT 0
      );
    `);
    await qr.query(
      `CREATE INDEX IF NOT EXISTS "idx_areas_city_id" ON "areas" ("city_id");`,
    );
    await qr.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "idx_areas_slug" ON "areas" ("slug");`,
    );

    // --- businesses: city_id + area_id columns ------------------------------
    await qr.query(
      `ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "city_id" uuid;`,
    );
    await qr.query(
      `ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "area_id" uuid;`,
    );
    await qr.query(
      `CREATE INDEX IF NOT EXISTS "idx_businesses_city_id" ON "businesses" ("city_id");`,
    );
    await qr.query(
      `CREATE INDEX IF NOT EXISTS "idx_businesses_area_id" ON "businesses" ("area_id");`,
    );

    // --- seed cities --------------------------------------------------------
    // Starter set of Jordanian cities (admin-extendable). The Ma'an apostrophe
    // is doubled per Postgres string-literal escaping.
    await qr.query(`
      INSERT INTO "cities" ("id", "slug", "name", "name_ar", "governorate", "sort_order")
      VALUES
        (gen_random_uuid(), 'amman',    'Amman',    'عمّان',    'Amman',    10),
        (gen_random_uuid(), 'zarqa',    'Zarqa',    'الزرقاء',  'Zarqa',    20),
        (gen_random_uuid(), 'irbid',    'Irbid',    'إربد',     'Irbid',    30),
        (gen_random_uuid(), 'russeifa', 'Russeifa', 'الرصيفة',  'Zarqa',    40),
        (gen_random_uuid(), 'salt',     'Salt',     'السلط',    'Balqa',    50),
        (gen_random_uuid(), 'aqaba',    'Aqaba',    'العقبة',   'Aqaba',    60),
        (gen_random_uuid(), 'madaba',   'Madaba',   'مادبا',    'Madaba',   70),
        (gen_random_uuid(), 'jerash',   'Jerash',   'جرش',      'Jerash',   80),
        (gen_random_uuid(), 'ajloun',   'Ajloun',   'عجلون',    'Ajloun',   90),
        (gen_random_uuid(), 'karak',    'Karak',    'الكرك',    'Karak',    100),
        (gen_random_uuid(), 'tafilah',  'Tafilah',  'الطفيلة',  'Tafilah',  110),
        (gen_random_uuid(), 'maan',     'Ma''an',   'معان',     'Ma''an',   120),
        (gen_random_uuid(), 'mafraq',   'Mafraq',   'المفرق',   'Mafraq',   130)
      ON CONFLICT ("slug") DO NOTHING;
    `);

    // --- seed areas ---------------------------------------------------------
    // Subselect joins the city_slug column from a VALUES table to its city.id.
    // Slugs are globally unique using the "<city>-<area>" convention.
    await qr.query(`
      INSERT INTO "areas" ("id", "city_id", "slug", "name", "name_ar", "sort_order")
      SELECT gen_random_uuid(), c.id, a.slug, a.name, a.name_ar, a.sort_order
      FROM (VALUES
        ('amman', 'amman-jabal-amman',       'Jabal Amman',           'جبل عمّان',                10),
        ('amman', 'amman-jabal-al-weibdeh',  'Jabal Al-Weibdeh',      'جبل اللويبدة',             20),
        ('amman', 'amman-abdoun',            'Abdoun',                'عبدون',                    30),
        ('amman', 'amman-sweifieh',          'Sweifieh',              'الصويفية',                 40),
        ('amman', 'amman-shmeisani',         'Shmeisani',             'الشميساني',                50),
        ('amman', 'amman-7th-circle',        '7th Circle',            'الدوار السابع',            60),
        ('amman', 'amman-khalda',            'Khalda',                'خلدا',                     70),
        ('amman', 'amman-tlaa-al-ali',       'Tla''a Al-Ali',         'تلاع العلي',               80),
        ('amman', 'amman-dabouq',            'Dabouq',                'دابوق',                    90),
        ('amman', 'amman-marka',             'Marka',                 'ماركا',                    100),
        ('amman', 'amman-al-balad',          'Al-Balad',              'البلد',                    110),
        ('amman', 'amman-abdali',            'Abdali Boulevard',      'العبدلي',                  120),
        ('amman', 'amman-madinah-st',        'Madinah Munawwarah St', 'شارع المدينة المنورة',     130),
        ('zarqa', 'zarqa-old',               'Old Zarqa',             'الزرقاء القديمة',          10),
        ('zarqa', 'zarqa-hashmiyyah',        'Al Hashmiyyah',         'الهاشمية',                 20),
        ('zarqa', 'zarqa-awajan',            'Awajan',                'عواجان',                   30),
        ('zarqa', 'zarqa-jabal-abyad',       'Al Jabal Al Abyad',     'الجبل الأبيض',             40),
        ('irbid', 'irbid-hawwarah',          'Hawwarah',              'حواره',                    10),
        ('irbid', 'irbid-aydoun',            'Aydoun',                'عيدون',                    20),
        ('irbid', 'irbid-bushra',            'Bushra',                'بشرى',                     30),
        ('irbid', 'irbid-ar-rahmaniyah',     'Ar Rahmaniyah',         'الرحمنية',                 40),
        ('irbid', 'irbid-yarmouk-st',        'Yarmouk University St', 'شارع الجامعة',             50)
      ) AS a(city_slug, slug, name, name_ar, sort_order)
      JOIN "cities" c ON c.slug = a.city_slug
      ON CONFLICT ("slug") DO NOTHING;
    `);

    // --- best-effort backfill: free-text city -> city_id (case-insensitive) -
    await qr.query(`
      UPDATE "businesses" b
      SET "city_id" = c."id"
      FROM "cities" c
      WHERE LOWER(c."name") = LOWER(b."city")
        AND b."city_id" IS NULL
        AND b."city" IS NOT NULL;
    `);

    // --- best-effort backfill: free-text area -> area_id, scoped by city ----
    await qr.query(`
      UPDATE "businesses" b
      SET "area_id" = a."id"
      FROM "areas" a
      WHERE LOWER(a."name") = LOWER(b."area")
        AND a."city_id" = b."city_id"
        AND b."area_id" IS NULL
        AND b."area" IS NOT NULL;
    `);
  }

  public async down(qr: QueryRunner): Promise<void> {
    await qr.query(`DROP INDEX IF EXISTS "idx_businesses_area_id";`);
    await qr.query(`DROP INDEX IF EXISTS "idx_businesses_city_id";`);
    await qr.query(`ALTER TABLE "businesses" DROP COLUMN IF EXISTS "area_id";`);
    await qr.query(`ALTER TABLE "businesses" DROP COLUMN IF EXISTS "city_id";`);
    await qr.query(`DROP TABLE IF EXISTS "areas";`);
    await qr.query(`DROP TABLE IF EXISTS "cities";`);
  }
}
