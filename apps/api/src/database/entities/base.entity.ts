import { randomUUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

// Mirrors Safeer's Base.ts: uuid PK, created/updated/deleted timestamps + audit columns.
// Every entity extends this (the consistency Safeer failed to keep).
// UUID is generated in-app via crypto.randomUUID() so no Postgres extension is required.
export abstract class BaseEntity {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column('uuid', { name: 'created_by', nullable: true })
  createdBy!: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @Column('uuid', { name: 'updated_by', nullable: true })
  updatedBy!: string | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @Column('uuid', { name: 'deleted_by', nullable: true })
  deletedBy!: string | null;
}
