import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProposalsTable1666690508413 implements MigrationInterface {
    name = 'createProposalsTable1666690508413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "proposals" ("proposalId" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerRequestId" uuid NOT NULL, "stylistId" uuid NOT NULL, "customerId" uuid NOT NULL, "createdBy" uuid NOT NULL, "message" text NOT NULL, "images" text, "status" character varying NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91572018e22ee2d1585dda6adf9" PRIMARY KEY ("proposalId"))`);
        await queryRunner.query(`ALTER TABLE "proposals" ADD CONSTRAINT "FK_dc96baae6ebc4763f3abdf51985" FOREIGN KEY ("customerRequestId") REFERENCES "customer_requests"("customerRequestId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proposals" ADD CONSTRAINT "FK_08b20c459cd672736b86746e17b" FOREIGN KEY ("stylistId") REFERENCES "stylists"("stylistId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proposals" ADD CONSTRAINT "FK_d86dfcf8793c8bd8a4af6bafa50" FOREIGN KEY ("customerId") REFERENCES "customers"("customerId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proposals" ADD CONSTRAINT "FK_6e3e60c9d0706c3c936013ee349" FOREIGN KEY ("createdBy") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proposals" DROP CONSTRAINT "FK_6e3e60c9d0706c3c936013ee349"`);
        await queryRunner.query(`ALTER TABLE "proposals" DROP CONSTRAINT "FK_d86dfcf8793c8bd8a4af6bafa50"`);
        await queryRunner.query(`ALTER TABLE "proposals" DROP CONSTRAINT "FK_08b20c459cd672736b86746e17b"`);
        await queryRunner.query(`ALTER TABLE "proposals" DROP CONSTRAINT "FK_dc96baae6ebc4763f3abdf51985"`);
        await queryRunner.query(`DROP TABLE "proposals"`);
    }

}
