import { MigrationInterface, QueryRunner } from "typeorm";

export class createUsersPricingTable1664436496157 implements MigrationInterface {
    name = 'createUsersPricingTable1664436496157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_pricing" ("userId" uuid NOT NULL, "hairCut" boolean DEFAULT false, "trim" boolean DEFAULT false, "extensions" boolean DEFAULT false, "keratine" boolean DEFAULT false, "color" boolean DEFAULT false, "perm" boolean DEFAULT false, "curling" boolean DEFAULT false, "highlights" boolean DEFAULT false, "conditioning" boolean DEFAULT false, "scalpMessage" boolean DEFAULT false, "flexibility" double precision DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_66c25bfa7805f768a776c2c35c" UNIQUE ("userId"), CONSTRAINT "PK_66c25bfa7805f768a776c2c35c3" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`ALTER TABLE "users_pricing" ADD CONSTRAINT "FK_66c25bfa7805f768a776c2c35c3" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_pricing" DROP CONSTRAINT "FK_66c25bfa7805f768a776c2c35c3"`);
        await queryRunner.query(`DROP TABLE "users_pricing"`);
    }

}
