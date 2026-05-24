import { MigrationInterface, QueryRunner } from 'typeorm';

// Initial schema for Aswaq.
// - Idempotent (IF NOT EXISTS + guarded enum creation) so the migration is replay-safe.
// - NO database foreign-key constraints (Aswaq policy): relations are plain *_id uuid columns
//   that TypeORM still maps in the entity layer. This keeps soft-deletes and snapshot rows
//   (e.g. order_items) cheap to manage and avoids cascade footguns.
// - Money columns are NUMERIC(10,2) and read back via the NumericTransformer.
export class InitSchema1779000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- enums --------------------------------------------------------------
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "user_role_enum" AS ENUM ('shopper', 'business', 'admin');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "subscription_tier_enum" AS ENUM ('basic', 'pro', 'premium');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    // The category enum is removed by the next migration in favour of a categories table.
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "business_category_enum" AS ENUM
          ('cafe', 'restaurant', 'gym', 'electronics', 'watches', 'jewelry');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    // --- users --------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "email" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "name" varchar(120) NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'shopper',
        "is_premium" boolean NOT NULL DEFAULT false
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");`);

    // --- businesses ---------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "businesses" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "name" varchar(160) NOT NULL,
        "category" "business_category_enum" NOT NULL,
        "area" varchar(160),
        "description" text,
        "is_verified" boolean NOT NULL DEFAULT false,
        "subscription_tier" "subscription_tier_enum" NOT NULL DEFAULT 'basic',
        "rating_avg" real NOT NULL DEFAULT 0,
        "review_count" int NOT NULL DEFAULT 0,
        "owner_id" uuid NOT NULL
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_businesses_owner_id" ON "businesses" ("owner_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_businesses_category" ON "businesses" ("category");`);

    // --- products -----------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "products" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "name" varchar(160) NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "rating_avg" real NOT NULL DEFAULT 0,
        "review_count" int NOT NULL DEFAULT 0,
        "business_id" uuid NOT NULL
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_products_business_id" ON "products" ("business_id");`);

    // --- reviews ------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "reviews" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "rating" smallint NOT NULL,
        "comment" text,
        "business_id" uuid NOT NULL,
        "product_id" uuid,
        "user_id" uuid NOT NULL
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_reviews_business_id" ON "reviews" ("business_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_reviews_product_id" ON "reviews" ("product_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_reviews_user_id" ON "reviews" ("user_id");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "reviews";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "businesses";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "business_category_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "subscription_tier_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum";`);
  }
}
