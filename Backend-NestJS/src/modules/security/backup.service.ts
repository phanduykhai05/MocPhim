import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  /**
   * Export toàn bộ database thành file SQL (INSERT statements).
   * Không cần pg_dump — chạy trực tiếp qua TypeORM DataSource.
   */
  async exportToSql(outPath: string): Promise<void> {
    const runner = this.dataSource.createQueryRunner();
    await runner.connect();

    try {
      // Lấy danh sách tất cả bảng trong schema public
      const tableRows: { tablename: string }[] = await runner.query(
        `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`,
      );

      const lines: string[] = [];
      lines.push(`-- MocPhim Database Backup`);
      lines.push(`-- Generated: ${new Date().toISOString()}`);
      lines.push(`-- Tables: ${tableRows.map((t) => t.tablename).join(', ')}`);
      lines.push('');
      lines.push('SET client_encoding = \'UTF8\';');
      lines.push('SET standard_conforming_strings = on;');
      lines.push('');

      for (const { tablename } of tableRows) {
        lines.push(`-- ──────────────────────────────────────────────`);
        lines.push(`-- Table: ${tablename}`);
        lines.push(`-- ──────────────────────────────────────────────`);

        // Lấy định nghĩa cột
        const cols: { column_name: string; data_type: string }[] = await runner.query(
          `SELECT column_name, data_type
           FROM information_schema.columns
           WHERE table_schema = 'public' AND table_name = $1
           ORDER BY ordinal_position`,
          [tablename],
        );

        if (cols.length === 0) continue;

        const colNames = cols.map((c) => `"${c.column_name}"`).join(', ');

        // Đọc toàn bộ rows
        const rows: Record<string, unknown>[] = await runner.query(
          `SELECT * FROM "${tablename}"`,
        );

        if (rows.length === 0) {
          lines.push(`-- (empty)`);
          lines.push('');
          continue;
        }

        lines.push(`INSERT INTO "${tablename}" (${colNames}) VALUES`);

        const valueLines = rows.map((row, idx) => {
          const vals = cols.map((c) => {
            const val = row[c.column_name];
            if (val === null || val === undefined) return 'NULL';
            if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
            if (typeof val === 'number') return String(val);
            if (val instanceof Date) return `'${val.toISOString()}'`;
            if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
            return `'${String(val).replace(/'/g, "''")}'`;
          });
          const suffix = idx < rows.length - 1 ? ',' : ';';
          return `  (${vals.join(', ')})${suffix}`;
        });

        lines.push(...valueLines);
        lines.push('');
      }

      lines.push('-- End of backup');
      fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
    } finally {
      await runner.release();
    }
  }
}
