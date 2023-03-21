import { CustomerRequests } from "modules/customerRequests/customerRequests.entity";
import { Customers } from "modules/customers/customers.entity";
import { ProposalsServices } from "modules/proposalsServices/proposalsServices.entity";
import { Stylists } from "modules/stylists/stylists.entity";
import { Users } from "modules/users/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ProposalsStatus } from "./proposals.type";

@Entity()
export class Proposals {
  @PrimaryGeneratedColumn('uuid')
  proposalId: string

  @JoinColumn({ name: 'customerRequestId' })
  @ManyToOne(() => CustomerRequests, customerRequest => customerRequest.customerRequestId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  customerRequestId: string | CustomerRequests

  @JoinColumn({ name: 'stylistId' })
  @ManyToOne(() => Stylists, stylist => stylist.stylistId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  stylistId: string

  @JoinColumn({ name: 'customerId' })
  @ManyToOne(() => Customers, customer => customer.customerId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  customerId: string

  @JoinColumn({ name: 'createdBy' })
  @ManyToOne(() => Users, user => user.userId, { onDelete: 'SET NULL' })
  @Column({ type: 'varchar'})
  createdBy: string

  @Column({ type: 'text'})
  message: string

  @Column({ type: 'simple-array', nullable: true})
  images: string[]

  @Column({ type: 'varchar', default: ProposalsStatus.PENDING})
  status: ProposalsStatus

  @OneToMany(() => ProposalsServices, proposalService => proposalService.proposalId)
  proposalServices: ProposalsServices[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}