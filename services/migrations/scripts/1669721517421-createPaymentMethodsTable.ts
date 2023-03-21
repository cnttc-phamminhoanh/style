import { MigrationInterface, QueryRunner } from "typeorm";

export class createPaymentMethodsTable1669721517421 implements MigrationInterface {
    name = 'createPaymentMethodsTable1669721517421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_methods" ("paymentMethodId" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" uuid NOT NULL, "stripePaymentMethodId" character varying NOT NULL, "type" character varying NOT NULL, "cardHolderName" character varying, "lastFourNumbers" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d7f5fbb8810fd2ce0f8394b3b52" PRIMARY KEY ("paymentMethodId"))`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_d710e1ff8589f1d708080a3a6e4" FOREIGN KEY ("customerId") REFERENCES "customers"("customerId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_d710e1ff8589f1d708080a3a6e4"`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
    }

}
