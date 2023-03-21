import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Gender, Provider, UserStatus } from "./users.type";
import { Permissions } from "modules/permissions/permissions.entity";

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('uuid')
  userId: string

  @Column({ type: 'varchar', nullable: true})
  firstName: string

  @Column({ type: 'varchar', nullable: true})
  lastName: string

  @Column({ type: 'varchar', unique: true, nullable: true })
  phoneNumber: string

  @Column({ type: 'varchar', nullable: true })
  email: string

  @Column({ type: 'text', nullable: true })
  bio: string

  @Column({ type: 'text', nullable: true })
  address: string

  @Column({ type: 'float', nullable: true })
  latitude: number

  @Column({ type: 'float', nullable: true })
  longitude: number

  @Column({ type: 'varchar', nullable: true })
  gender: Gender

  @Column({ type: 'varchar', nullable: true })
  avatar: string

  @Column({ type: 'varchar', nullable: true, default: Provider.STYLE_VIDIA })
  provider: string

  @Column({ type: 'varchar', nullable: true, unique: true })
  providerId: string

  @Column({ type: 'varchar', default: UserStatus.INACTIVE })
  status: UserStatus

  @OneToMany(() => Permissions, permissions => permissions.userId)
  permissions: Permissions[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}