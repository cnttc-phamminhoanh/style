import { MigrationInterface, QueryRunner } from "typeorm";

export class addProviderColumnsToUsersTable1672195176822 implements MigrationInterface {
    name = 'addProviderColumnsToUsersTable1672195176822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "provider" character varying DEFAULT 'STYLE_VIDIA'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "providerId" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fab34e0791096b2a0a1bf8bd7ff" UNIQUE ("providerId")`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "maximumDistance" TYPE double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fab34e0791096b2a0a1bf8bd7ff"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "providerId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "provider"`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "maximumDistance" TYPE integer`);
    }

}
