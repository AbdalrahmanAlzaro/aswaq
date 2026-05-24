import { MigrationInterface, QueryRunner } from 'typeorm';

// Adds three feature tables on top of MarketplaceData:
//   - media          (polymorphic: owner_type + owner_id, no FK by policy)
//   - price_history  (append-only product price log; ProductService writes a row in-tx)
//   - favorites      (one row per (user_id, business_id), unique)
// Same conventions: idempotent (IF NOT EXISTS + guarded enums), no FK constraints,
// indexes on every *_id column.
export class MediaPriceFavorites1779200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- enums --------------------------------------------------------------
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "media_owner_type_enum" AS ENUM ('business', 'product', 'review');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "media_kind_enum" AS ENUM ('logo', 'cover', 'gallery');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    // --- media --------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "media" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "owner_type" "media_owner_type_enum" NOT NULL,
        "owner_id" uuid NOT NULL,
        "url" varchar(500) NOT NULL,
        "kind" "media_kind_enum" NOT NULL DEFAULT 'gallery',
        "sort_order" int NOT NULL DEFAULT 0,
        "alt_text" varchar(255)
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_media_owner_id" ON "media" ("owner_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_media_owner" ON "media" ("owner_type", "owner_id");`);

    // --- price_history ------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "price_history" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "product_id" uuid NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "recorded_at" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_price_history_product_id" ON "price_history" ("product_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_price_history_recorded_at" ON "price_history" ("recorded_at");`);

    // --- favorites ----------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "favorites" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "user_id" uuid NOT NULL,
        "business_id" uuid NOT NULL
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_favorites_user_id" ON "favorites" ("user_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_favorites_business_id" ON "favorites" ("business_id");`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "uq_favorites_user_business" ON "favorites" ("user_id", "business_id");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "favorites";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "price_history";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "media";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "media_kind_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "media_owner_type_enum";`);
  }
}
