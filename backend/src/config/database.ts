import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private supabase: SupabaseClient;

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
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

  public getClient(): SupabaseClient {
    return this.supabase;
  }

  public async connect(): Promise<void> {
    try {
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
      const { error } = await this.supabase
        .from('organisations')
        .select('count')
        .limit(1);
      
      return !error;
    } catch {
      return false;
    }
  }
}

export const config = DatabaseConfig.getInstance();
