import { Rooms } from "../../modules/rooms/rooms.entity";
import { Users } from "../../modules/users/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { RoomMemberStatus } from "./roomMembers.type";

@Entity()
export class RoomMembers {
  @PrimaryGeneratedColumn('uuid')
  roomMemberId: string

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  userId: string

  @JoinColumn({ name: 'roomId' })
  @ManyToOne(() => Rooms, room => room.roomId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  roomId: string

  @Column({ type: 'varchar', default: RoomMemberStatus.ACTIVE})
  status: RoomMemberStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}