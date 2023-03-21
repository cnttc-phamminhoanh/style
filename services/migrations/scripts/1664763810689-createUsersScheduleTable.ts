import { MigrationInterface, QueryRunner } from "typeorm";

export class createUsersScheduleTable1664763810689 implements MigrationInterface {
    name = 'createUsersScheduleTable1664763810689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_schedule" ("userId" uuid NOT NULL, "monday" character varying, "tuesday" character varying, "wednesday" character varying, "thursday" character varying, "friday" character varying, "saturday" character varying, "sunday" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_1ecf1c69a9af30599cf657b1e0" UNIQUE ("userId"), CONSTRAINT "PK_1ecf1c69a9af30599cf657b1e04" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`ALTER TABLE "users_schedule" ADD CONSTRAINT "FK_1ecf1c69a9af30599cf657b1e04" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_schedule" DROP CONSTRAINT "FK_1ecf1c69a9af30599cf657b1e04"`);
        await queryRunner.query(`DROP TABLE "users_schedule"`);
    }

}
