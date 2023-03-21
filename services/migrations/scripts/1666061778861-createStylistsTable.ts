import { MigrationInterface, QueryRunner } from "typeorm";

export class createStylistsTable1666061778861 implements MigrationInterface {
    name = 'createStylistsTable1666061778861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stylists" ("stylistId" uuid NOT NULL, "bio" text, "introduce" text, "images" text, "rate" double precision, "flexibility" double precision, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_4abe5636b41f3f62c3bd186d2b" UNIQUE ("stylistId"), CONSTRAINT "PK_4abe5636b41f3f62c3bd186d2bd" PRIMARY KEY ("stylistId"))`);
        await queryRunner.query(`ALTER TABLE "stylists" ADD CONSTRAINT "FK_4abe5636b41f3f62c3bd186d2bd" FOREIGN KEY ("stylistId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stylists" DROP CONSTRAINT "FK_4abe5636b41f3f62c3bd186d2bd"`);
        await queryRunner.query(`DROP TABLE "stylists"`);
    }

}
