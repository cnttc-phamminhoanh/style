import { Customers } from "modules/customers/customers.entity";
import { Proposals } from "modules/proposals/proposals.entity";
import { Services } from "modules/services/services.entity";
import { Stylists } from "modules/stylists/stylists.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class ProposalsServices {
  @PrimaryGeneratedColumn('uuid')
  proposalServiceId: string

  @JoinColumn({ name: 'stylistId' })
  @ManyToOne(() => Stylists, stylist => stylist.stylistId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  stylistId: string

  @JoinColumn({ name: 'customerId' })
  @ManyToOne(() => Customers, customer => customer.customerId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  customerId: string

  @JoinColumn({ name: 'serviceId' })
  @ManyToOne(() => Services, service => service.serviceId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  serviceId: string

  @JoinColumn({ name: 'proposalId' })
  @ManyToOne(() => Proposals, Proposal => Proposal.proposalId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  proposalId: string

  @Column({ type: 'float'})
  price: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}