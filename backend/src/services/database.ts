import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

// PostgreSQL connection pool with proper configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

pool.on('connect', (client) => {
  logger.debug('New client connected to database');
});

pool.on('remove', (client) => {
  logger.debug('Client removed from database pool');
});

/**
 * Database utility class for standardized connection handling
 */
export class DatabaseService {
  /**
   * Execute a query with automatic connection management
   * @param queryText - SQL query string
   * @param params - Query parameters
   * @returns Query result
   */
  static async query(queryText: string, params?: any[]) {
    const client = await pool.connect();
    try {
      const result = await client.query(queryText, params);
      return result;
    } catch (error) {
      logger.error('Database query error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        query: queryText,
        params: params?.length ? '[REDACTED]' : undefined
      });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Execute multiple queries in a transaction
   * @param queries - Array of query objects with text and params
   * @returns Array of query results
   */
  static async transaction(queries: Array<{ text: string; params?: any[] }>) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const results = [];
      
      for (const query of queries) {
        const result = await client.query(query.text, query.params);
        results.push(result);
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Database transaction error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        queryCount: queries.length
      });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get a client for manual connection management
   * Use this when you need to manage the connection lifecycle manually
   * @returns PoolClient
   */
  static async getClient(): Promise<PoolClient> {
    return await pool.connect();
  }

  /**
   * Execute a function with a database client (automatic connection management)
   * @param fn - Function that receives a client and returns a result
   * @returns Result of the function
   */
  static async withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
      return await fn(client);
    } finally {
      client.release();
    }
  }

  /**
   * Health check for database connection
   * @returns boolean indicating if database is healthy
   */
  static async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      logger.error('Database health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Get pool statistics
   * @returns Pool statistics
   */
  static getPoolStats() {
    return {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };
  }

  /**
   * Gracefully close all connections in the pool
   */
  static async close() {
    await pool.end();
    logger.info('Database pool closed');
  }
}

// Export the pool for direct access if needed
export { pool };

// Export a default instance for convenience
export default DatabaseService;
