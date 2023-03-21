import { MigrationInterface, QueryRunner } from "typeorm";

export class createRoomsTable1667358730145 implements MigrationInterface {
    name = 'createRoomsTable1667358730145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rooms" ("roomId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, "description" text, "status" character varying NOT NULL DEFAULT 'ACTIVE', "createdBy" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_31962cf242c2fdc6889493d9a99" PRIMARY KEY ("roomId"))`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_054f341a286d38c25ca2b89e530" FOREIGN KEY ("createdBy") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_054f341a286d38c25ca2b89e530"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
    }

}
