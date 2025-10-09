import { IDatabaseService } from '@module/db/application/interfaces/database.service.interfaces';
import {
  ERROR_FETCHING_ALL_MODELS,
  ERROR_FETCHING_SCHEMA,
  ERROR_FETCHING_TABLE_SCHEMA,
  FORBIDDEN_SQL_OPERATION,
} from '@module/db/application/messages/database.messages';
import {
  getDatabaseType,
  getSqlQueriesByDbType,
} from '@module/db/application/utils/database.utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import AppDataSource from '../../../../config/orm.config';

@Injectable()
export class DatabaseService implements IDatabaseService {
  private dataSource = AppDataSource;
  private dbType = getDatabaseType();
  private sqlQueries = getSqlQueriesByDbType(this.dbType);

  async executeQuery(
    query: string,
    parameters: unknown[] = [],
  ): Promise<unknown> {
    const forbiddenKeywords = [
      'DELETE',
      'UPDATE',
      'INSERT',
      'DROP',
      'ALTER',
      'CREATE',
      'TRUNCATE',
      'RENAME',
    ];

    const upperQuery = query.toUpperCase().replace(/::[a-zA-Z]+/g, '');

    for (const keyword of forbiddenKeywords) {
      const forbiddenPattern = new RegExp(`\\b${keyword}\\b`, 'g');

      if (forbiddenPattern.test(upperQuery)) {
        throw new HttpException(
          `${FORBIDDEN_SQL_OPERATION}: ${keyword}`,
          HttpStatus.FORBIDDEN,
        );
      }
    }

    return await this.dataSource.query(query, parameters);
  }

  async allModels(): Promise<{ [key: string]: string }[]> {
    try {
      if (process.env.NODE_ENV === 'automated_tests') {
        await this.dataSource.initialize();
      }
      return await this.dataSource.query(this.sqlQueries.show_tables);
    } catch (error) {
      throw new Error(ERROR_FETCHING_ALL_MODELS);
    }
  }

  async getTableSchema(tableName: string): Promise<Record<string, unknown>[]> {
    try {
      return await this.dataSource.query(
        this.sqlQueries.get_table_schema(tableName),
      );
    } catch (error) {
      throw new Error(ERROR_FETCHING_TABLE_SCHEMA);
    }
  }

  async databaseInfo(): Promise<
    {
      tableName: string;
      columns: Record<string, unknown>[];
    }[]
  > {
    try {
      const allModelsInDb = await this.allModels();

      const schemaPromises = allModelsInDb.map(
        async (model: { Tables_in_database: string }) => {
          let tableName: string;

          if (process.env.NODE_ENV === 'automated_tests') {
            tableName = model['name'];
          } else {
            tableName = model[this.sqlQueries.tableNameByDbType];
          }

          const schema = await this.getTableSchema(tableName);
          return {
            tableName,
            columns: schema,
          };
        },
      );

      return await Promise.all(schemaPromises);
    } catch (error) {
      throw new Error(ERROR_FETCHING_SCHEMA);
    }
  }
}
