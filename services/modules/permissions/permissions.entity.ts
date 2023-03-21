import { Users } from "../users/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PermissionStatus, RoleName } from "./permissions.type";

@Entity()
export class Permissions {

  @PrimaryGeneratedColumn('uuid')
  permissionId: string

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  userId: string | Users

  @Column({ type: 'varchar', nullable: false })
  roleName: RoleName

  @Column({ type: 'varchar', nullable: false })
  status: PermissionStatus

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}