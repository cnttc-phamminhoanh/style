import { MigrationInterface, QueryRunner } from "typeorm";

export class createProposalsServicesTable1666692142955 implements MigrationInterface {
    name = 'createProposalsServicesTable1666692142955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "proposals_services" ("proposalServiceId" uuid NOT NULL DEFAULT uuid_generate_v4(), "stylistId" uuid NOT NULL, "customerId" uuid NOT NULL, "serviceId" uuid NOT NULL, "proposalId" uuid NOT NULL, "price" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9d387bb7a2c7a7fecba1d25e5f9" PRIMARY KEY ("proposalServiceId"))`);
        await queryRunner.query(`ALTER TABLE "proposals_services" ADD CONSTRAINT "FK_0203b0442008a91768f5c3a8e9c" FOREIGN KEY ("stylistId") REFERENCES "stylists"("stylistId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proposals_services" ADD CONSTRAINT "FK_1d386129d4236ca9f9aafddbcdf" FOREIGN KEY ("customerId") REFERENCES "customers"("customerId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proposals_services" ADD CONSTRAINT "FK_323b1f66592924aee9c913aa4f8" FOREIGN KEY ("serviceId") REFERENCES "services"("serviceId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proposals_services" ADD CONSTRAINT "FK_7731f7b778fbcd552e833c808a1" FOREIGN KEY ("proposalId") REFERENCES "proposals"("proposalId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proposals_services" DROP CONSTRAINT "FK_7731f7b778fbcd552e833c808a1"`);
        await queryRunner.query(`ALTER TABLE "proposals_services" DROP CONSTRAINT "FK_323b1f66592924aee9c913aa4f8"`);
        await queryRunner.query(`ALTER TABLE "proposals_services" DROP CONSTRAINT "FK_1d386129d4236ca9f9aafddbcdf"`);
        await queryRunner.query(`ALTER TABLE "proposals_services" DROP CONSTRAINT "FK_0203b0442008a91768f5c3a8e9c"`);
        await queryRunner.query(`DROP TABLE "proposals_services"`);
    }

}
