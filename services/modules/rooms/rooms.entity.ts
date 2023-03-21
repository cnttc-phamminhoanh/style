import { RoomMembers } from "../../modules/roomMembers/roomMembers.entity";
import { Users } from "../../modules/users/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { RoomStatus } from "./rooms.type";

@Entity()
export class Rooms {
  @PrimaryGeneratedColumn('uuid')
  roomId: string

  @Column({ type: 'text', nullable: true})
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'varchar', default: RoomStatus.ACTIVE})
  status: RoomStatus

  @JoinColumn({ name: 'createdBy' })
  @ManyToOne(() => Users, user => user.userId, { onDelete: 'SET NULL' })
  @Column({ type: 'varchar'})
  createdBy: string

  @OneToMany(() => RoomMembers, roomMember => roomMember.roomId)
  roomMembers: RoomMembers[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}