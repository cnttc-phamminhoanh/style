import {MigrationInterface, QueryRunner} from "typeorm";

export class addLocationColumnsIntoUserTable1663644730270 implements MigrationInterface {
    name = 'addLocationColumnsIntoUserTable1663644730270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "profilePhoto" TO "avatar"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "latitude" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "longitude" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "avatar" TO "profilePhoto"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "location" json`);
    }

}
