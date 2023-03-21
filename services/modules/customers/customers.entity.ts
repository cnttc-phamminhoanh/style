import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Users } from "../../modules/users/users.entity";

@Entity()
export class Customers {
  @PrimaryColumn('uuid')
  @JoinColumn({ name: 'customerId' })
  @OneToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  customerId: string

  @Column({ type: "varchar", nullable: true })
  stripeCustomerId: string

  @Column({ type: 'float', nullable: true })
  maximumDistance: number

  @Column({ type: 'varchar', nullable: true })
  hairType: string

  @Column({ type: 'varchar', nullable: true  })
  preferredStyle: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}