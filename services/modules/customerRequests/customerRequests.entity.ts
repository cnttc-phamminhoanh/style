import { Customers } from "modules/customers/customers.entity";
import { Proposals } from "modules/proposals/proposals.entity";
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
import { CustomerRequestsStatus } from "./customerRequests.type";

@Entity()
export class CustomerRequests {
  @PrimaryGeneratedColumn('uuid')
  customerRequestId: string

  @JoinColumn({ name: 'customerId' })
  @ManyToOne(() => Customers, customer => customer.customerId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  customerId: string

  @Column({ type: 'simple-array'})
  currentPictures: string[]

  @Column({ type: 'simple-array'})
  samplePictures: string[]

  @Column({ type: 'float'})
  price: number

  @Column({ type: 'timestamp'})
  time: Date

  @Column({ type: 'varchar', default: CustomerRequestsStatus.OPENING })
  status: CustomerRequestsStatus

  @OneToMany(() => Proposals, proposal => proposal.customerRequestId)
  proposals: Proposals[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}