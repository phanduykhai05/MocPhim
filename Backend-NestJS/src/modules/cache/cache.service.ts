import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private client: Redis | null = null;
  private available = false;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const host = this.config.get<string>('REDIS_HOST', 'localhost');
    const port = this.config.get<number>('REDIS_PORT', 6379);
    const password = this.config.get<string>('REDIS_PASSWORD');

    try {
      this.client = new Redis({
        host,
        port,
        password: password || undefined,
        lazyConnect: true,
        connectTimeout: 5000,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // disable auto-retry on startup
      });

      await this.client.connect();
      this.available = true;
      this.logger.log(`Redis connected at ${host}:${port}`);
    } catch (err: any) {
      this.logger.warn(`Redis unavailable (${err.message}) — running without cache`);
      this.available = false;
    }
  }

  async onModuleDestroy() {
    if (this.client) await this.client.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.available || !this.client) return null;
    try {
      const raw = await this.client.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.available || !this.client) return;
    try {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (err: any) {
      this.logger.warn(`Cache set error: ${err.message}`);
    }
  }

  async del(pattern: string): Promise<void> {
    if (!this.available || !this.client) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) await this.client.del(...keys);
    } catch (err: any) {
      this.logger.warn(`Cache del error: ${err.message}`);
    }
  }
}
