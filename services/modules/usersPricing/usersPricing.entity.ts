import { Users } from "../users/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UsersPricing {
  @PrimaryColumn('uuid')
  @JoinColumn({ name: 'userId' })
  @OneToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  userId: string

  @Column({ type: 'boolean', nullable: true, default: false })
  hairCut: boolean

  @Column({ type: 'boolean', nullable: true, default: false })
  trim: boolean

  @Column({ type: 'boolean', nullable: true, default: false })
  extensions: boolean

  @Column({ type: 'boolean', nullable: true, default: false })
  keratine: boolean

  @Column({ type: 'boolean', nullable: true, default: false })
  color: boolean

  @Column({ type: 'boolean', nullable: true, default: false })
  perm: boolean

  @Column({ type: 'boolean', nullable: true, default: false })
  curling: boolean

  @Column({ type: 'boolean', nullable: true, default: false })
  highlights: boolean

  @Column({ type: 'boolean', nullable: true, default: false })
  conditioning: boolean

  @Column({ type: 'boolean', nullable: true, default: false })
  scalpMessage: boolean

  @Column({ type: 'float', nullable: true, default: 0 })
  flexibility: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}