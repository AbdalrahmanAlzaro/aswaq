import { MigrationInterface, QueryRunner } from 'typeorm';

// Cross-market price comparison: a canonical catalog of items that multiple
// businesses can offer at different prices.
//   - catalog_items                 (the shared item)
//   - products.catalog_item_id      (nullable link from a seller's offer)
//   - "grocery" category            (seed reference data — the catalog flow's
//                                    first use-case is the rice 5kg demo)
// Same conventions: idempotent (IF NOT EXISTS), no FK constraints, indexes on
// every *_id column.
export class Catalog1779300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- catalog_items ------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "catalog_items" (
        "id" uuid PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "deleted_at" timestamptz,
        "deleted_by" uuid,
        "name" varchar(160) NOT NULL,
        "name_ar" varchar(160),
        "category_id" uuid NOT NULL,
        "unit" varchar(60) NOT NULL,
        "brand" varchar(120),
        "image_url" varchar(500)
      );
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_catalog_items_category_id" ON "catalog_items" ("category_id");`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_catalog_items_name" ON "catalog_items" ("name");`,
    );

    // --- products: catalog link --------------------------------------------
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "catalog_item_id" uuid;`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_products_catalog_item_id" ON "products" ("catalog_item_id");`,
    );

    // --- grocery category (needed for the rice 5kg demo + the catalog UI) --
    await queryRunner.query(`
      INSERT INTO "categories" ("id", "slug", "name", "name_ar", "is_luxury", "sort_order")
      VALUES (gen_random_uuid(), 'grocery', 'Grocery', 'بقالة', false, 15)
      ON CONFLICT ("slug") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_catalog_item_id";`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "catalog_item_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "catalog_items";`);
    await queryRunner.query(`DELETE FROM "categories" WHERE "slug" = 'grocery';`);
  }
}
