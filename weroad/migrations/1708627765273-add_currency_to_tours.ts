import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrencyToTours1708627765273 implements MigrationInterface {
  name = 'AddCurrencyToTours1708627765273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tours" ADD "currency" character varying(3) NOT NULL DEFAULT 'EUR'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "currency"`);
  }
}
