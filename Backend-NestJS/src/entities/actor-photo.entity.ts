import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('actor_photos')
export class ActorPhoto {
  @PrimaryColumn()
  actorSlug: string;

  @Column({ nullable: true })
  actorName: string;

  @Column({ nullable: true })
  photoUrl: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
