import { D1Database } from '@cloudflare/workers-types'
import { tablesCreationQueries } from './utils/sql'

export class DatabaseConnection {
  private static dbInstance: DatabaseConnection
  private db: D1Database
  private isInitialized = false

  private constructor(db: D1Database) {
    this.db = db
  }

  public static async initialize(db: D1Database): Promise<DatabaseConnection> {
    if (DatabaseConnection.dbInstance) {
      return DatabaseConnection.dbInstance
    }

    DatabaseConnection.dbInstance = new DatabaseConnection(db)
    await DatabaseConnection.dbInstance.createTables()
    DatabaseConnection.dbInstance.isInitialized = true

    return DatabaseConnection.dbInstance
  }

  private async createTables() {
    if (this.isInitialized) {
      return
    }

    try {
      for (const query of tablesCreationQueries) {
        await this.db.exec(query)
      }
    } catch (error) {
      console.error('Failed to create tables:', error)
      throw error
    }
  }

  getDatabase(): D1Database {
    return this.db
  }

  public static getInstance(): DatabaseConnection {
    if (DatabaseConnection.dbInstance == null) {
      throw new Error('Database not initialized. Call the initialize function')
    }

    return DatabaseConnection.dbInstance
  }
}
