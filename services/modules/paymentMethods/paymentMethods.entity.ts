import { Customers } from "modules/customers/customers.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentMethodsType } from "./paymentMethods.type";

@Entity()
export class PaymentMethods {
  @PrimaryGeneratedColumn('uuid')
  paymentMethodId: string

  @ManyToOne(() => Customers, customer => customer.customerId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  @Column({ type: 'uuid' })
  customerId: string

  @Column('varchar')
  stripePaymentMethodId: string

  @Column('varchar')
  type: PaymentMethodsType

  @Column({ type: 'varchar', nullable: true})
  cardHolderName: string

  @Column({ type: 'varchar', nullable: true})
  lastFourNumbers: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}