import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryConfig, QueryResult, QueryResultRow } from 'pg';
import { PG_POOL } from './database.constants';

@Injectable()
export class DbService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  // Parameterized query helper
  async query<T extends QueryResultRow = any>(
    textOrConfig: string | QueryConfig<any[]>,
    params?: any[],
  ): Promise<QueryResult<T>> {
    return typeof textOrConfig === 'string'
      ? this.pool.query<T>(textOrConfig, params)
      : this.pool.query<T>(textOrConfig);
  }

  // Transaction helper
  async tx<T>(
    fn: (client: { query: Pool['query'] }) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
