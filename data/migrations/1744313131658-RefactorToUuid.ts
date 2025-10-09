import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorToUuid1744313131658 implements MigrationInterface {
  name = 'RefactorToUuid1744313131658';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "FK_fa09ea26c5837f4f4160ae55715"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "FK_df2409dcd1dade9038a7d79e653"`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying NOT NULL, "error" character varying, "message_id" character varying NOT NULL, "queue_name" character varying NOT NULL, "sender_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_ba01f0a3e0123651915008bc578" UNIQUE ("id"), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_a95e949168be7b7ece1a2382fed"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "genre" DROP CONSTRAINT "UQ_3e554b051ddcb121a7e3d946e69"`,
    );
    await queryRunner.query(`ALTER TABLE "genre" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "UQ_0a5875eb5ec460206c670c3b62d"`,
    );
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "author" DROP CONSTRAINT "UQ_c81b134c9ae0af445f2a0c05031"`,
    );
    await queryRunner.query(`ALTER TABLE "author" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_cace4a159ff9f2512dd42373760" UNIQUE ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "genre" DROP CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141"`,
    );
    await queryRunner.query(`ALTER TABLE "genre" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "genre" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "genre" ADD CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "genre" ADD CONSTRAINT "UQ_0285d4f1655d080cfcf7d1ab141" UNIQUE ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "FK_24b753b0490a992a6941451f405"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4"`,
    );
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "book" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "UQ_a3afef72ec8f80e6e5c310b28a4" UNIQUE ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "author_id"`);
    await queryRunner.query(`ALTER TABLE "book" ADD "author_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "author" DROP CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871"`,
    );
    await queryRunner.query(`ALTER TABLE "author" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "author" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "author" ADD CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "author" ADD CONSTRAINT "UQ_5a0e79799d372fe56f2f3fa6871" UNIQUE ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "PK_fc04095a7baa645066bab7e80f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "PK_df2409dcd1dade9038a7d79e653" PRIMARY KEY ("genre_id")`,
    );
    await queryRunner.query(`ALTER TABLE "book_genre" DROP COLUMN "book_id"`);
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD "book_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "PK_df2409dcd1dade9038a7d79e653"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "PK_fc04095a7baa645066bab7e80f7" PRIMARY KEY ("genre_id", "book_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "PK_fc04095a7baa645066bab7e80f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "PK_fa09ea26c5837f4f4160ae55715" PRIMARY KEY ("book_id")`,
    );
    await queryRunner.query(`ALTER TABLE "book_genre" DROP COLUMN "genre_id"`);
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD "genre_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "PK_fa09ea26c5837f4f4160ae55715"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "PK_fc04095a7baa645066bab7e80f7" PRIMARY KEY ("book_id", "genre_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fa09ea26c5837f4f4160ae5571" ON "book_genre" ("book_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df2409dcd1dade9038a7d79e65" ON "book_genre" ("genre_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "FK_24b753b0490a992a6941451f405" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "FK_fa09ea26c5837f4f4160ae55715" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "FK_df2409dcd1dade9038a7d79e653" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "FK_df2409dcd1dade9038a7d79e653"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "FK_fa09ea26c5837f4f4160ae55715"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "FK_24b753b0490a992a6941451f405"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_df2409dcd1dade9038a7d79e65"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fa09ea26c5837f4f4160ae5571"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "PK_fc04095a7baa645066bab7e80f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "PK_fa09ea26c5837f4f4160ae55715" PRIMARY KEY ("book_id")`,
    );
    await queryRunner.query(`ALTER TABLE "book_genre" DROP COLUMN "genre_id"`);
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD "genre_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "PK_fa09ea26c5837f4f4160ae55715"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "PK_fc04095a7baa645066bab7e80f7" PRIMARY KEY ("genre_id", "book_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "PK_fc04095a7baa645066bab7e80f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "PK_df2409dcd1dade9038a7d79e653" PRIMARY KEY ("genre_id")`,
    );
    await queryRunner.query(`ALTER TABLE "book_genre" DROP COLUMN "book_id"`);
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD "book_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" DROP CONSTRAINT "PK_df2409dcd1dade9038a7d79e653"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "PK_fc04095a7baa645066bab7e80f7" PRIMARY KEY ("book_id", "genre_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "author" DROP CONSTRAINT "UQ_5a0e79799d372fe56f2f3fa6871"`,
    );
    await queryRunner.query(
      `ALTER TABLE "author" DROP CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871"`,
    );
    await queryRunner.query(`ALTER TABLE "author" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "author" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "author" ADD CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "author_id"`);
    await queryRunner.query(`ALTER TABLE "book" ADD "author_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "UQ_a3afef72ec8f80e6e5c310b28a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4"`,
    );
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "book" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "FK_24b753b0490a992a6941451f405" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "genre" DROP CONSTRAINT "UQ_0285d4f1655d080cfcf7d1ab141"`,
    );
    await queryRunner.query(
      `ALTER TABLE "genre" DROP CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141"`,
    );
    await queryRunner.query(`ALTER TABLE "genre" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "genre" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "genre" ADD CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "author" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "author" ADD CONSTRAINT "UQ_c81b134c9ae0af445f2a0c05031" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "UQ_0a5875eb5ec460206c670c3b62d" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "genre" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "genre" ADD CONSTRAINT "UQ_3e554b051ddcb121a7e3d946e69" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_a95e949168be7b7ece1a2382fed" UNIQUE ("uuid")`,
    );
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "FK_df2409dcd1dade9038a7d79e653" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genre" ADD CONSTRAINT "FK_fa09ea26c5837f4f4160ae55715" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
