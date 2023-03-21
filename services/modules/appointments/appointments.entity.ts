import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AppointmentStatus } from "./appointments.type";
import { Users } from "../users/users.entity";
import { AppointmentServices } from "modules/appointmentServices/appointmentServices.entity";
import { Payments } from "modules/payments/payments.entity";

@Entity()
export class Appointments {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('uuid')
  appointmentId: string;

  @JoinColumn({ name: 'stylistId' })
  @ManyToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  stylistId: string

  @JoinColumn({ name: 'customerId' })
  @ManyToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  customerId: string | Users

  @JoinColumn({ name: 'createdBy' })
  @ManyToOne(() => Users, user => user.userId, { onDelete: 'SET NULL' })
  @Column({ type: 'varchar'})
  createdBy: string

  @Column({ type: 'varchar', nullable: true, default: AppointmentStatus.PENDING})
  status: AppointmentStatus

  @Column({ type: 'timestamp'})
  time: Date

  @Column({ type: 'varchar'})
  notes: string

  @OneToMany(() => AppointmentServices, appointments => appointments.appointmentId)
  services: AppointmentServices[]

  @OneToMany(() => Payments, payments => payments.appointmentId)
  payments: Payments[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
