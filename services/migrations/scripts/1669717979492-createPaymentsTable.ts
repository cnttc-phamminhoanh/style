import { MigrationInterface, QueryRunner } from "typeorm";

export class createPaymentsTable1669717979492 implements MigrationInterface {
    name = 'createPaymentsTable1669717979492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payments" ("paymentId" uuid NOT NULL DEFAULT uuid_generate_v4(), "appointmentId" uuid, "grossAmount" double precision NOT NULL, "fee" double precision NOT NULL, "netAmount" double precision NOT NULL, "discount" double precision, "tip" double precision, "description" character varying, "status" character varying DEFAULT 'PENDING', "sender" uuid NOT NULL, "receiver" uuid NOT NULL, "createdBy" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_ae0b0903f275c81d8a2a45ce3b5" PRIMARY KEY ("paymentId"))`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "stripeCustomerId" character varying`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_90213a20c94916e46cd2131364f" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("appointmentId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_2a1daeb8ec240d136612840a14e" FOREIGN KEY ("sender") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_b6e6c576a54d6179523b70dcdf8" FOREIGN KEY ("receiver") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_044f399afc445ec3094473acb93" FOREIGN KEY ("createdBy") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_044f399afc445ec3094473acb93"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_b6e6c576a54d6179523b70dcdf8"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_2a1daeb8ec240d136612840a14e"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_90213a20c94916e46cd2131364f"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "stripeCustomerId"`);
        await queryRunner.query(`DROP TABLE "payments"`);
    }

}
