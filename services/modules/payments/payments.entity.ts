import { Appointments } from "../../modules/appointments/appointments.entity";
import { ZeroDecimalCurrencies, Currency } from "../../modules/paymentIntents/paymentIntent.type";
import { Users } from "../../modules/users/users.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { PaymentStatus } from "./payments.type";
import { formatAmount } from "./helpers";

@Entity()
export class Payments {
  @PrimaryGeneratedColumn('uuid')
  paymentId: string

  @ManyToOne(() => Appointments, appointment => appointment.appointmentId, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'appointmentId' })
  @Column({ type: 'uuid', nullable: true })
  appointmentId: string

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

  @Column({
    type: "float",
    nullable: true,
    precision: 2,
    transformer: formatAmount
  })
  discount?: number

  @Column({ type: "varchar", nullable: true })
  description?: string

  @Column({ type: "varchar", default: PaymentStatus.PENDING })
  status: PaymentStatus

  @Column({
    type: "float",
    nullable: true,
    precision: 2,
    transformer: formatAmount
  })
  tip: number

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

  @Column({ type: "varchar", default: Currency.USD })
  currency: Currency | ZeroDecimalCurrencies
}