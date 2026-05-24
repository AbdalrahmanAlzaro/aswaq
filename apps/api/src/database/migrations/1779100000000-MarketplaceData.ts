import { MigrationInterface, QueryRunner } from 'typeorm';

// Completes the Aswaq data model on top of InitSchema:
//   - categories (replaces the business_category_enum)
//   - extra columns on businesses / products
//   - orders + order_items, subscription_plans + business_subscriptions, payments
// Same conventions as InitSchema: idempotent, no FK constraints, indexes on every *_id.
export class MarketplaceData1779100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- enums --------------------------------------------------------------
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "order_status_enum" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "payment_purpose_enum" AS ENUM ('premium_upgrade', 'business_subscription', 'order');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "payment_status_enum" AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    // --- categories ---------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "categories" (
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
        "icon" varchar(80),
        "is_luxury" boolean NOT NULL DEFAULT false,
        "sort_order" int NOT NULL DEFAULT 0,
        "is_active" boolean NOT NULL DEFAULT true
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "idx_categories_slug" ON "categories" ("slug");`);

    // Seed the six original BusinessCategory values so existing rows can be mapped.
    // Marks watches + jewelry as luxury (matches the original LUXURY_CATEGORIES constant).
    await queryRunner.query(`
      INSERT INTO "categories" ("id", "slug", "name", "name_ar", "is_luxury", "sort_order")
      VALUES
        (gen_random_uuid(), 'cafe',        'Cafe',        'مقهى',        false, 10),
        (gen_random_uuid(), 'restaurant',  'Restaurant',  'مطعم',        false, 20),
        (gen_random_uuid(), 'gym',         'Gym',         'نادي رياضي',   false, 30),
        (gen_random_uuid(), 'electronics', 'Electronics', 'إلكترونيات',   false, 40),
        (gen_random_uuid(), 'watches',     'Watches',     'ساعات',       true,  50),
        (gen_random_uuid(), 'jewelry',     'Jewelry',     'مجوهرات',     true,  60)
      ON CONFLICT ("slug") DO NOTHING;
    `);

    // --- businesses: new columns + category_id swap -------------------------
    await queryRunner.query(`ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "city" varchar(120);`);
    await queryRunner.query(`ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "address" varchar(255);`);
    await queryRunner.query(`ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "latitude" numeric(9,6);`);
    await queryRunner.query(`ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "longitude" numeric(9,6);`);
    await queryRunner.query(`ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "phone" varchar(32);`);
    await queryRunner.query(`ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "logo_url" varchar(500);`);
    await queryRunner.query(`ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "cover_url" varchar(500);`);
    await queryRunner.query(`ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "category_id" uuid;`);

    // backfill category_id from the old enum column (if it still exists)
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
           WHERE table_name = 'businesses' AND column_name = 'category'
        ) THEN
          UPDATE "businesses" b
             SET "category_id" = c."id"
            FROM "categories" c
           WHERE c."slug" = b."category"::text
             AND b."category_id" IS NULL;
        END IF;
      END $$;
    `);

    // drop the old enum column + index + type (guarded so a re-run is safe)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_businesses_category";`);
    await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN IF EXISTS "category";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "business_category_enum";`);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_businesses_category_id" ON "businesses" ("category_id");`);

    // Only mark category_id NOT NULL if every existing row was backfilled — keeps the
    // migration replay-safe on databases that pre-date the categories table.
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM "businesses" WHERE "category_id" IS NULL) THEN
          ALTER TABLE "businesses" ALTER COLUMN "category_id" SET NOT NULL;
        END IF;
      END $$;
    `);

    // --- products: new columns ---------------------------------------------
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "description" text;`);
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "image_url" varchar(500);`);
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "currency" varchar(8) NOT NULL DEFAULT 'JD';`);
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "is_available" boolean NOT NULL DEFAULT true;`);

    // --- orders -------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "user_id" uuid NOT NULL,
        "business_id" uuid NOT NULL,
        "status" "order_status_enum" NOT NULL DEFAULT 'pending',
        "total" numeric(10,2) NOT NULL,
        "currency" varchar(8) NOT NULL DEFAULT 'JD',
        "notes" text
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_orders_user_id" ON "orders" ("user_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_orders_business_id" ON "orders" ("business_id");`);

    // --- order_items --------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "order_items" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "order_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "product_name" varchar(160) NOT NULL,
        "unit_price" numeric(10,2) NOT NULL,
        "quantity" int NOT NULL,
        "line_total" numeric(10,2) NOT NULL
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_order_items_order_id" ON "order_items" ("order_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_order_items_product_id" ON "order_items" ("product_id");`);

    // --- subscription_plans -------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "subscription_plans" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "slug" varchar(80) NOT NULL,
        "name" varchar(120) NOT NULL,
        "tier" "subscription_tier_enum" NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "currency" varchar(8) NOT NULL DEFAULT 'JD',
        "period_days" int NOT NULL,
        "description" text,
        "is_active" boolean NOT NULL DEFAULT true
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "idx_subscription_plans_slug" ON "subscription_plans" ("slug");`);

    // --- business_subscriptions --------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "business_subscriptions" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "business_id" uuid NOT NULL,
        "plan_id" uuid NOT NULL,
        "starts_at" timestamptz NOT NULL,
        "ends_at" timestamptz NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "cancelled_at" timestamptz
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_business_subscriptions_business_id" ON "business_subscriptions" ("business_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_business_subscriptions_plan_id" ON "business_subscriptions" ("plan_id");`);

    // --- payments -----------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "user_id" uuid NOT NULL,
        "purpose" "payment_purpose_enum" NOT NULL,
        "order_id" uuid,
        "business_subscription_id" uuid,
        "amount" numeric(10,2) NOT NULL,
        "currency" varchar(8) NOT NULL DEFAULT 'JD',
        "status" "payment_status_enum" NOT NULL DEFAULT 'pending',
        "provider_ref" varchar(255)
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_payments_user_id" ON "payments" ("user_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_payments_order_id" ON "payments" ("order_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_payments_business_subscription_id" ON "payments" ("business_subscription_id");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "payments";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "business_subscriptions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subscription_plans";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "order_items";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "orders";`);

    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "is_available";`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "currency";`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "image_url";`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "description";`);

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_businesses_category_id";`);
    await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN IF EXISTS "category_id";`);
    await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN IF EXISTS "cover_url";`);
    await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN IF EXISTS "logo_url";`);
    await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN IF EXISTS "phone";`);
    await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN IF EXISTS "longitude";`);
    await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN IF EXISTS "latitude";`);
    await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN IF EXISTS "address";`);
    await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN IF EXISTS "city";`);

    await queryRunner.query(`DROP TABLE IF EXISTS "categories";`);

    await queryRunner.query(`DROP TYPE IF EXISTS "payment_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_purpose_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "order_status_enum";`);
  }
}
