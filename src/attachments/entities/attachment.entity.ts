import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MimeType } from '../../domains/entities/mime-type.entity';
import { Todo } from '../../todos/entities/todo.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'bytea' })
  file: Buffer;

  @ManyToOne(() => MimeType, { eager: false })
  @JoinColumn()
  mimeType: MimeType | number;

  @ManyToOne(() => Todo, { eager: false })
  @JoinColumn()
  todo: Todo | number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn()
  user: User | number;
}
