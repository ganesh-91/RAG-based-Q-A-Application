import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Document } from '../../documents/entities/document.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string; // admin, editor, viewer

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];
}
