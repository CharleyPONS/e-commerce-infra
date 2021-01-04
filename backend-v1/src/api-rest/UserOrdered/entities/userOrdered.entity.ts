import { Required } from '@tsed/schema';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import { UserOrderedProductsEntity } from './userOrderedProducts.entity';
import { Transporter } from '../../Configuration/entities/transporter.enum';

// Use save in place of update to apply hook middleware

@Entity({ name: 'user_ordered' })
export class UserOrderedEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  userOrderedId: string;

  @PrimaryGeneratedColumn()
  billId?: number;

  @Column({ type: 'boolean' })
  paid?: boolean;

  @Column({ type: 'real' })
  amount: number;

  @Column({ type: 'varchar', length: '255' })
  transporter: Transporter;

  @Column({ type: 'varchar', length: '255' })
  dateUpdate: string;

  @OneToMany(() => UserOrderedProductsEntity, userOrderedProduct => userOrderedProduct.userOrder, {
    cascade: true
  })
  product: UserOrderedProductsEntity[];

  @Column({ type: 'uuid', nullable: true })
  userId: string;
  @BeforeInsert()
  @BeforeUpdate()
  private updateDates() {
    this.dateUpdate = new Date().toUTCString();
  }
}
