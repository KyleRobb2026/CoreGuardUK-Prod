import { supabase } from '../config/supabase'

// Database service for CoreGuard SMS
export const databaseService = {
  // Generic CRUD operations
  async create(table, recordData) {
    const { data, error } = await supabase
      .from(table)
      .insert(recordData)
      .select()
    
    if (error) throw error
    return data
  },

  async read(table, options = {}) {
    let query = supabase.from(table).select(options.select || '*')
    
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending })
    }
    
    if (options.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  },

  async update(table, id, recordData) {
    const { data: updatedData, error } = await supabase
      .from(table)
      .update(recordData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return updatedData
  },

  async delete(table, id) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Auth related operations
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Real-time subscriptions
  subscribe(table, callback, options = {}) {
    let subscription = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', 
        { 
          event: options.event || '*', 
          schema: 'public', 
          table: table,
          filter: options.filter 
        }, 
        callback
      )
      .subscribe()
    
    return subscription
  }
}

export default databaseService
