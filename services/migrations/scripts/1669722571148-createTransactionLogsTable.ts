import { MigrationInterface, QueryRunner } from "typeorm";

export class createTransactionLogsTable1669722571148 implements MigrationInterface {
    name = 'createTransactionLogsTable1669722571148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_logs" ("transactionLogId" uuid NOT NULL DEFAULT uuid_generate_v4(), "transactionId" uuid NOT NULL, "grossAmount" double precision NOT NULL, "fee" double precision NOT NULL, "netAmount" double precision NOT NULL, "type" character varying NOT NULL, "content" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e1f6a3a6b1089d6e675315c4ab0" PRIMARY KEY ("transactionLogId"))`);
        await queryRunner.query(`ALTER TABLE "transaction_logs" ADD CONSTRAINT "FK_31c27c1e305b66c380e9fbfe9f0" FOREIGN KEY ("transactionId") REFERENCES "transactions"("transactionId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_logs" DROP CONSTRAINT "FK_31c27c1e305b66c380e9fbfe9f0"`);
        await queryRunner.query(`DROP TABLE "transaction_logs"`);
    }

}
