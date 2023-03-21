import { MigrationInterface, QueryRunner } from "typeorm";

export class createServicesTable1666063580132 implements MigrationInterface {
    name = 'createServicesTable1666063580132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "services" ("serviceId" uuid NOT NULL DEFAULT uuid_generate_v4(), "stylistId" uuid NOT NULL, "serviceName" character varying NOT NULL, "price" double precision NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_bd9b50de0bd3040ab0debaf36f5" PRIMARY KEY ("serviceId"))`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_4ebfeda8dfc740b6a98fb4e6abb" FOREIGN KEY ("stylistId") REFERENCES "stylists"("stylistId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_services" ADD CONSTRAINT "FK_e6c70753e072adbd25ea521c890" FOREIGN KEY ("serviceId") REFERENCES "services"("serviceId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_4ebfeda8dfc740b6a98fb4e6abb"`);
        await queryRunner.query(`DROP TABLE "services"`);
    }

}
