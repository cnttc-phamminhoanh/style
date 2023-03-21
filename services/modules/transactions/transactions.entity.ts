import { ZeroDecimalCurrencies, Currency } from "../../modules/paymentIntents/paymentIntent.type";
import { Payments } from "../../modules/payments/payments.entity";
import { Users } from "../../modules/users/users.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TransactionsStatus, TransactionsType } from "./transactions.type";
import { formatAmount } from "modules/payments/helpers";

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string

  @ManyToOne(() => Payments, payment => payment.paymentId)
  @JoinColumn({ name: 'paymentId' })
  @Column({ type: 'uuid' })
  paymentId: string

  @Column({ type: "varchar" })
  stripePaymentId: string

  @Column({
    type: "float",
    precision: 2,
    transformer: formatAmount
  })
  grossAmount: number

  @Column({
    type: "float",
    precision: 2,
    transformer: formatAmount
  })
  fee: number

  @Column({
    type: "float",
    precision: 2,
    transformer: formatAmount
  })
  netAmount: number

  @Column({ type: "varchar" })
  type: TransactionsType

  @Column({ type: "varchar", nullable: true })
  description: string

  @Column({ type: "varchar" })
  status: TransactionsStatus

  @ManyToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender' })
  @Column({ type: 'uuid' })
  sender: string

  @ManyToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver' })
  @Column({ type: 'uuid' })
  receiver: string

  @ManyToOne(() => Users, user => user.userId, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  @Column({ type: 'uuid' })
  createdBy: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @Column({ type: "varchar", nullable: true })
  nextActions?: string

  @Column({ type: "varchar", default: Currency.USD })
  currency: Currency | ZeroDecimalCurrencies
}