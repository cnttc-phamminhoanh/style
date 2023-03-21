import { MigrationInterface, QueryRunner } from "typeorm";

export class createConnectedAccountsTable1669721755094 implements MigrationInterface {
    name = 'createConnectedAccountsTable1669721755094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "connected_accounts" ("stylistId" uuid NOT NULL, "stripeConnectedAccountId" character varying NOT NULL, "type" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_262e530499eaaf2258cdca41e2" UNIQUE ("stylistId"), CONSTRAINT "PK_262e530499eaaf2258cdca41e2f" PRIMARY KEY ("stylistId"))`);
        await queryRunner.query(`ALTER TABLE "connected_accounts" ADD CONSTRAINT "FK_262e530499eaaf2258cdca41e2f" FOREIGN KEY ("stylistId") REFERENCES "stylists"("stylistId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connected_accounts" DROP CONSTRAINT "FK_262e530499eaaf2258cdca41e2f"`);
        await queryRunner.query(`DROP TABLE "connected_accounts"`);
    }

}
