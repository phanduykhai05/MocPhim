import {
  Entity, PrimaryGeneratedColumn, Column,
  UpdateDateColumn, Index,
} from 'typeorm';

@Entity('search_history')
export class SearchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
  keyword: string;

  @Column({ default: 1 })
  searchCount: number;

  @UpdateDateColumn()
  lastSearchedAt: Date;
}
