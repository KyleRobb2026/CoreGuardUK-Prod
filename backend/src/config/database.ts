import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private supabase: SupabaseClient;

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      // Don't throw error, just log warning and create a mock client
      console.warn('Supabase configuration missing. Database features will be limited.');
      this.supabase = null;
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public getClient(): SupabaseClient | null {
    return this.supabase;
  }

  public async connect(): Promise<void> {
    try {
      if (!this.supabase) {
        console.warn('Database not configured, skipping connection test');
        return;
      }
      
      // Test connection
      const { data, error } = await this.supabase
        .from('organisations')
        .select('count')
        .limit(1);

      if (error) {
        // If table doesn't exist, that's expected for new deployments
        if (error.code === 'PGRST116') {
          logger.warn('Database tables not yet created. Please run the migration script.');
        } else {
          throw error;
        }
      }

      logger.info('Database connection established');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    // Supabase client doesn't require explicit disconnection
    logger.info('Database connection closed');
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.supabase) {
        return false; // Database not configured
      }
      
      // Simple ping to check if Supabase is accessible
      const { error } = await this.supabase.rpc('version');
      
      // If rpc doesn't work, try a simple select from information_schema
      if (error && error.code === 'PGRST116') {
        const { error: fallbackError } = await this.supabase
          .from('pg_tables')
          .select('tablename')
          .limit(1);
        return !fallbackError;
      }
      
      return !error;
    } catch {
      return false;
    }
  }
}

export const config = DatabaseConfig.getInstance();
