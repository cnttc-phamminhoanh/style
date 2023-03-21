import {MigrationInterface, QueryRunner} from "typeorm";

export class createUserTable1663419542126 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying, "address" text, "bio" text, "location" json, "gender" character varying NOT NULL, "profilePhoto" character varying, "status" character varying NOT NULL DEFAULT 'INACTIVE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293" UNIQUE ("phoneNumber"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"));`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
