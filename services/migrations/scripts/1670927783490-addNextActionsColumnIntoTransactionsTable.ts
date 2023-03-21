import { MigrationInterface, QueryRunner } from "typeorm";

export class addNextActionsColumnIntoTransactionsTable1670927783490 implements MigrationInterface {
    name = 'addNextActionsColumnIntoTransactionsTable1670927783490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ADD "nextActions" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "nextActions"`);
    }
}
