import { Stylists } from "../../modules/stylists/stylists.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ServiceStatus } from "./services.type";

@Entity({ name: 'services'})
export class Services {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('uuid')
  serviceId: string;

  @JoinColumn({ name: 'stylistId' })
  @ManyToOne(() => Stylists, stylist => stylist.stylistId, { onDelete: 'CASCADE' })
  @Column({ type: 'varchar'})
  stylistId: string

  @Column({ type: 'varchar'})
  serviceName: string

  @Column({ type: 'float'})
  price: number

  @Column({ type: 'varchar' })
  status: ServiceStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}