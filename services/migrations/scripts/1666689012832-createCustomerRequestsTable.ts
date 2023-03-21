import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomerRequestsTable1666689012832 implements MigrationInterface {
    name = 'createCustomerRequestsTable1666689012832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer_requests" ("customerRequestId" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" uuid NOT NULL, "currentPictures" text NOT NULL, "samplePictures" text NOT NULL, "price" double precision NOT NULL, "time" TIMESTAMP NOT NULL, "status" character varying NOT NULL DEFAULT 'OPENING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c15dc35f3caedb2c5f3bc93abf6" PRIMARY KEY ("customerRequestId"))`);
        await queryRunner.query(`ALTER TABLE "customer_requests" ADD CONSTRAINT "FK_6d8be9631777a6f334b6312f57c" FOREIGN KEY ("customerId") REFERENCES "customers"("customerId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_requests" DROP CONSTRAINT "FK_6d8be9631777a6f334b6312f57c"`);
        await queryRunner.query(`DROP TABLE "customer_requests"`);
    }

}
