import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import pg from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: pg.Pool;

  onModuleInit() {
    this.pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const res = await this.pool.query(sql, params);
    return res.rows;
  }
}
