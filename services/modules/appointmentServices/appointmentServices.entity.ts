import { Appointments } from "../appointments/appointments.entity";
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
import { Users } from "../users/users.entity";
import { Services } from "modules/services/services.entity";

@Entity()
export class AppointmentServices {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('uuid')
  appointmentServiceId: string

  @JoinColumn({ name: 'appointmentId' })
  @ManyToOne(() => Appointments, appointment => appointment.appointmentId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  appointmentId: string

  @JoinColumn({ name: 'stylistId' })
  @ManyToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  stylistId: string

  @JoinColumn({ name: 'customerId' })
  @ManyToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  customerId: string

  @JoinColumn({ name: 'createdBy' })
  @ManyToOne(() => Users, user => user.userId, { onDelete: 'SET NULL' })
  @Column({ type: 'varchar'})
  createdBy: string

  @JoinColumn({ name: 'serviceId' })
  @ManyToOne(() => Services, service => service.serviceId, { onDelete: 'SET NULL' })
  @Column({ type: 'varchar', unique: false})
  serviceId: string

  @Column({ type: 'varchar'})
  serviceName: string

  @Column({ type: 'float'})
  price: number // price in USD

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
