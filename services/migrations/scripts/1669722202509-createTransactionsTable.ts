import { MigrationInterface, QueryRunner } from "typeorm";

export class createTransactionsTable1669722202509 implements MigrationInterface {
    name = 'createTransactionsTable1669722202509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("transactionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentId" uuid NOT NULL, "stripePaymentId" character varying NOT NULL, "grossAmount" double precision NOT NULL, "fee" double precision NOT NULL, "netAmount" double precision NOT NULL, "type" character varying NOT NULL, "description" character varying, "status" character varying NOT NULL, "sender" uuid NOT NULL, "receiver" uuid NOT NULL, "createdBy" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1eb69759461752029252274c105" PRIMARY KEY ("transactionId"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f" FOREIGN KEY ("paymentId") REFERENCES "payments"("paymentId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_7e1a585f3cdf1f5697d57579719" FOREIGN KEY ("sender") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_07b7a48cc077392d7e524798f84" FOREIGN KEY ("receiver") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_4dcd67cc38a7958c8cbb35b4b3f" FOREIGN KEY ("createdBy") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_4dcd67cc38a7958c8cbb35b4b3f"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_07b7a48cc077392d7e524798f84"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_7e1a585f3cdf1f5697d57579719"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
