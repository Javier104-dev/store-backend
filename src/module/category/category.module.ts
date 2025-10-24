import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategorySchema } from './infrastructure/database/category.schema';

@Module({
  imports: [TypeOrmModule.forFeature([CategorySchema])],
})
export class CategoryModule {}
