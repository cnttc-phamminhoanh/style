import { Services } from "modules/services/services.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Users } from "../../modules/users/users.entity";

@Entity()
export class Stylists {
  @PrimaryColumn('uuid')
  @JoinColumn({ name: 'stylistId' })
  @OneToOne(() => Users, user => user.userId, { onDelete: 'CASCADE' })
  stylistId: string

  @Column({ type: 'text', nullable: true })
  bio: string

  @Column({ type: 'text', nullable: true })
  introduce: string

  @Column({ type: 'simple-array', nullable: true  })
  images: string[]

  @Column({ type: 'float', nullable: true  })
  rate: number

  @Column({ type: 'float', nullable: true  })
  flexibility: number

  @OneToMany(() => Services, service => service.stylistId)
  services: Services[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}