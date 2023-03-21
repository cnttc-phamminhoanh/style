import { MigrationInterface, QueryRunner } from "typeorm";

export class createCustomersTable1666687327452 implements MigrationInterface {
    name = 'createCustomersTable1666687327452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("customerId" uuid NOT NULL, "maximumDistance" integer, "hairType" character varying, "preferredStyle" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_0d6a9c16d0c9bacffc0a784a18" UNIQUE ("customerId"), CONSTRAINT "PK_0d6a9c16d0c9bacffc0a784a186" PRIMARY KEY ("customerId"))`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_0d6a9c16d0c9bacffc0a784a186" FOREIGN KEY ("customerId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_0d6a9c16d0c9bacffc0a784a186"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
