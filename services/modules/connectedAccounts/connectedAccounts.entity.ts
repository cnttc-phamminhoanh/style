import { Stylists } from "modules/stylists/stylists.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ConnectedAccountsStatus, ConnectedAccountsType } from "./connectedAccounts.type";

@Entity()
export class ConnectedAccounts {
  @PrimaryColumn('uuid')
  @JoinColumn({ name: 'stylistId' })
  @OneToOne(() => Stylists, stylist => stylist.stylistId, { onDelete: 'CASCADE' })
  stylistId: string

  @Column('varchar')
  stripeConnectedAccountId: string

  @Column('varchar')
  type: ConnectedAccountsType

  @Column('varchar')
  status: ConnectedAccountsStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}