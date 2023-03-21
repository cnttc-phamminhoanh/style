import { MigrationInterface, QueryRunner } from "typeorm";

export class createAppointmentsTable1664906194254 implements MigrationInterface {
    name = 'createAppointmentsTable1664906194254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointments" ("appointmentId" uuid NOT NULL DEFAULT uuid_generate_v4(), "stylistId" uuid NOT NULL, "customerId" uuid NOT NULL, "createdBy" uuid NOT NULL, "status" character varying DEFAULT 'PENDING', "time" TIMESTAMP NOT NULL, "notes" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_16345caffd6ea5e1a799639b012" PRIMARY KEY ("appointmentId"))`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_1f691eb8fb68187556d2aff5428" FOREIGN KEY ("stylistId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_60dbcf20669c096d319e20fca8a" FOREIGN KEY ("customerId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_97d83f20a09181645dbb3b9b48f" FOREIGN KEY ("createdBy") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_97d83f20a09181645dbb3b9b48f"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_60dbcf20669c096d319e20fca8a"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_1f691eb8fb68187556d2aff5428"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
    }

}
