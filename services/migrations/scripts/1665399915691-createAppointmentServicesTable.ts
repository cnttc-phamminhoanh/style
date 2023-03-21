import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppointmentServicesTable1665399915691 implements MigrationInterface {
    name = 'createAppointmentServicesTable1665399915691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointment_services" ("appointmentServiceId" uuid NOT NULL DEFAULT uuid_generate_v4(), "appointmentId" uuid NOT NULL, "stylistId" uuid NOT NULL, "customerId" uuid NOT NULL, "createdBy" uuid NOT NULL, "serviceId" uuid NOT NULL, "serviceName" character varying NOT NULL, "price" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_09f2dc1d7f9429161a67624e12a" PRIMARY KEY ("appointmentServiceId"))`);
        await queryRunner.query(`ALTER TABLE "appointment_services" ADD CONSTRAINT "FK_0d96cf6582c33fafac115779919" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("appointmentId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_services" ADD CONSTRAINT "FK_163463a944a44a9482e5a2a0f1a" FOREIGN KEY ("stylistId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_services" ADD CONSTRAINT "FK_40f2215195b1ea97b7c51a7d27e" FOREIGN KEY ("customerId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_services" ADD CONSTRAINT "FK_70e67f9ea469999adbcafcebd1d" FOREIGN KEY ("createdBy") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment_services" DROP CONSTRAINT "FK_70e67f9ea469999adbcafcebd1d"`);
        await queryRunner.query(`ALTER TABLE "appointment_services" DROP CONSTRAINT "FK_40f2215195b1ea97b7c51a7d27e"`);
        await queryRunner.query(`ALTER TABLE "appointment_services" DROP CONSTRAINT "FK_163463a944a44a9482e5a2a0f1a"`);
        await queryRunner.query(`ALTER TABLE "appointment_services" DROP CONSTRAINT "FK_0d96cf6582c33fafac115779919"`);
        await queryRunner.query(`DROP TABLE "appointment_services"`);
    }

}