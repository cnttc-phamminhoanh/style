import { ZeroDecimalCurrencies, Currency } from "../../modules/paymentIntents/paymentIntent.type";
import { Transactions } from "../../modules/transactions/transactions.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TransactionLogsType } from "./transactionLogs.type";
import { formatAmount } from "modules/payments/helpers";

@Entity()
export class TransactionLogs {
  @PrimaryGeneratedColumn('uuid')
  transactionLogId: string

  @ManyToOne(() => Transactions, transaction => transaction.transactionId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transactionId'})
  @Column('uuid')
  transactionId: string

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

  @Column('varchar')
  type: TransactionLogsType

  @Column({ type: "varchar", nullable: true })
  content: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ type: "varchar", default: Currency.USD })
  currency: Currency | ZeroDecimalCurrencies
}