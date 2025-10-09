export const DATABASE_SERVICE_KEY = 'DatabaseService';

export interface IDatabaseService {
  executeQuery(query: string, parameters: unknown[]): Promise<unknown>;

  allModels(): Promise<{ [key: string]: string }[]>;

  getTableSchema(tableName: string): Promise<Record<string, unknown>[]>;

  databaseInfo(): Promise<
    {
      tableName: string;
      columns: Record<string, unknown>[];
    }[]
  >;
}
