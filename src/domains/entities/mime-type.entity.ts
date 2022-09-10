import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MimeType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  desc: string;
}
