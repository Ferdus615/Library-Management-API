import { Module, Global, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PG_POOL } from './database.constants';
import { DbService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: PG_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pool = new Pool({
          connectionString: config.get<string>('CONNECTION_STRING'),
          max: 10,
          idleTimeoutMillis: 30_000,
          connectionTimeoutMillis: 5_000,
        });

        // optional: log errors
        pool.on('error', (err) => {
          console.error('Unexpected PG pool error', err);
        });

        return pool;
      },
    },
    DbService,
    // graceful shutdown
    {
      provide: 'PG_POOL_CLEANUP',
      inject: [PG_POOL],
      useFactory: (pool: Pool) =>
        ({
          async onModuleDestroy() {
            await pool.end();
          },
        }) as OnModuleDestroy,
    },
  ],
  exports: [PG_POOL, DbService],
})
export class DatabaseModule {}
