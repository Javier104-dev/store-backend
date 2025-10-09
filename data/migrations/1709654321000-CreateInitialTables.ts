import { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey } from 'typeorm';

export class CreateInitialTables1709654321000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isUnique: true,
          },
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'external_id',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'roles',
            type: 'varchar',
          },
          {
            name: 'is_verified',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'author',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'genre',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'book',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'author_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'book_genre',
        columns: [
          {
            name: 'book_id',
            type: 'int',
          },
          {
            name: 'genre_id',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createPrimaryKey('book_genre', ['book_id', 'genre_id']);

    await queryRunner.createForeignKey(
      'book',
      new TableForeignKey({
        columnNames: ['author_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'author',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'book_genre',
      new TableForeignKey({
        columnNames: ['book_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'book',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'book_genre',
      new TableForeignKey({
        columnNames: ['genre_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'genre',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const bookGenreTable = await queryRunner.getTable('book_genre');
    const bookTable = await queryRunner.getTable('book');

    const bookGenreForeignKeys = bookGenreTable.foreignKeys;
    const bookForeignKeys = bookTable.foreignKeys;

    await Promise.all([
      ...bookGenreForeignKeys.map((foreignKey) =>
        queryRunner.dropForeignKey('book_genre', foreignKey),
      ),
      ...bookForeignKeys.map((foreignKey) =>
        queryRunner.dropForeignKey('book', foreignKey),
      ),
    ]);

    await queryRunner.dropTable('book_genre');
    await queryRunner.dropTable('book');
    await queryRunner.dropTable('genre');
    await queryRunner.dropTable('author');
    await queryRunner.dropTable('user');
  }
}
