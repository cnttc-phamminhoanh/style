import { MigrationInterface, QueryRunner } from "typeorm";

export class createRoomMembersTable1667358857628 implements MigrationInterface {
    name = 'createRoomMembersTable1667358857628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "room_members" ("roomMemberId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "roomId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_aa46b7568946c199020eecc6431" PRIMARY KEY ("roomMemberId"))`);
        await queryRunner.query(`ALTER TABLE "room_members" ADD CONSTRAINT "FK_ca3c84760fb37c2f14658a0a2ec" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_members" ADD CONSTRAINT "FK_a27f901523ddfa2eaecb16a5976" FOREIGN KEY ("roomId") REFERENCES "rooms"("roomId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_members" DROP CONSTRAINT "FK_a27f901523ddfa2eaecb16a5976"`);
        await queryRunner.query(`ALTER TABLE "room_members" DROP CONSTRAINT "FK_ca3c84760fb37c2f14658a0a2ec"`);
        await queryRunner.query(`DROP TABLE "room_members"`);
    }

}
