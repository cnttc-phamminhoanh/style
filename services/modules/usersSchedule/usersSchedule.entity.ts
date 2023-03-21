import { Users } from "../users/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UsersSchedule {
  @PrimaryColumn('uuid')
  @JoinColumn({ name: 'userId' })
  @OneToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  userId: string

  @Column({ type: 'varchar', nullable: true })
  monday: string

  @Column({ type: 'varchar', nullable: true })
  tuesday: string

  @Column({ type: 'varchar', nullable: true })
  wednesday: string

  @Column({ type: 'varchar', nullable: true })
  thursday: string

  @Column({ type: 'varchar', nullable: true })
  friday: string

  @Column({ type: 'varchar', nullable: true })
  saturday: string

  @Column({ type: 'varchar', nullable: true })
  sunday: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}