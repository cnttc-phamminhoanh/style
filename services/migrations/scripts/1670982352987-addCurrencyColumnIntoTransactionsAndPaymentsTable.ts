import { MigrationInterface, QueryRunner } from "typeorm";

export class addCurrencyColumnIntoTransactionsAndPaymentsTable1670982352987 implements MigrationInterface {
    name = 'addCurrencyColumnIntoTransactionsAndPaymentsTable1670982352987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ADD "currency" character varying NOT NULL DEFAULT 'USD'`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "currency" character varying NOT NULL DEFAULT 'USD'`);
        await queryRunner.query(`ALTER TABLE "transaction_logs" ADD "currency" character varying NOT NULL DEFAULT 'USD'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_logs" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "currency"`);
    }
}
