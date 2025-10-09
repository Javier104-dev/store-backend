import { loadComponents } from '@module/adminjs/components/components';
import importESMModule from '@module/adminjs/utils/import-esm-modules.util';
import { AuthorSchema } from '@module/author/infrastructure/database/author.schema';
import { Book } from '@module/book/domain/book.entity';
import { BookSchema } from '@module/book/infrastructure/database/book.schema';
import { Genre } from '@module/genre/domain/genre.entity';
import { GenreSchema } from '@module/genre/infrastructure/database/genre.schema';
import { AppRole } from '@module/iam/authorization/domain/app-role.enum';
import { UserSchema } from '@module/iam/user/infrastructure/database/user.schema';

import { hasRole } from '@common/admin/infrastructure/database/admin-permissions';

export const adminSchemas = [UserSchema, AuthorSchema, BookSchema, GenreSchema];

export const adminResources = [
  {
    schema: UserSchema,
    options: {
      properties: {
        roles: {
          type: 'string',
          isArray: true,
        },
      },
      actions: {
        new: { isVisible: false },
        edit: {
          isAccessible: hasRole([AppRole.SuperAdmin]),
        },
        delete: {
          isAccessible: hasRole([AppRole.SuperAdmin]),
        },
        list: {
          isVisible: hasRole([AppRole.SuperAdmin]),
        },
        show: {
          isVisible: true,
        },
      },
    },
  },
  {
    schema: AuthorSchema,
    features: [
      async () => {
        const { componentLoader } = await loadComponents();
        const { RelationType, owningRelationSettingsFeature } =
          await importESMModule('@adminjs/relations');

        return owningRelationSettingsFeature({
          componentLoader,
          licenseKey: process.env.ADMINJS_RELATIONS_LICENSE_KEY,
          relations: {
            books: {
              type: RelationType.OneToMany,
              target: {
                resourceId: Book.name,
                joinKey: 'authorId',
              },
            },
          },
        });
      },
    ],
  },
  {
    schema: BookSchema,
    features: [
      async () => {
        const { componentLoader } = await loadComponents();
        const { RelationType, owningRelationSettingsFeature } =
          await importESMModule('@adminjs/relations');

        return owningRelationSettingsFeature({
          componentLoader,
          licenseKey: process.env.ADMINJS_RELATIONS_LICENSE_KEY,
          relations: {
            genres: {
              type: RelationType.ManyToMany,
              junction: {
                joinKey: 'book_id',
                inverseJoinKey: 'genre_id',
                throughResourceId: 'book_genre',
              },
              target: {
                resourceId: Genre.name,
              },
            },
          },
        });
      },

      async () => {
        const { targetRelationSettingsFeature } =
          await importESMModule('@adminjs/relations');
        return targetRelationSettingsFeature();
      },
    ],
    actions: {
      new: { isVisible: true },
      edit: { isVisible: true },
      delete: { isVisible: true },
      list: { isVisible: true },
      show: { isVisible: true },
      findRelation: { isVisible: true },
      addManyToManyRelation: { isVisible: true },
      deleteRelation: { isVisible: true },
    },
  },
  {
    schema: GenreSchema,
    features: [
      async () => {
        const { targetRelationSettingsFeature } =
          await importESMModule('@adminjs/relations');
        return targetRelationSettingsFeature();
      },
    ],
    actions: {
      new: { isVisible: true },
      edit: { isVisible: true },
      delete: { isVisible: true },
      list: { isVisible: true },
      show: { isVisible: true },
      findRelation: { isVisible: true },
      addManyToManyRelation: { isVisible: true },
      deleteRelation: { isVisible: true },
    },
  },
];
