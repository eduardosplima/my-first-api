import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Attachment } from '../../attachments/entities/attachment.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn()
  user: User | number;

  @OneToMany(() => Attachment, (attachment) => attachment.todo, {
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  attachments: Array<Attachment | number>;
}
