import { Policies } from '@module/iam/authorization/infrastructure/policy/decorator/policy.decorator';
import { PolicyGuard } from '@module/iam/authorization/infrastructure/policy/guard/policy.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/query-param/page-query-params.dto';
import { SortOptions } from '@common/base/get-all-options.interface';
import { GetAllSwaggerDecorator } from '@common/base/interface/getAllSwaggerDecorator';

import { BookDto } from '@/module/book/application/dto/book.dto';
import { CreateBookDto } from '@/module/book/application/dto/create-book.dto';
import { BookFieldsQueryParamsDto } from '@/module/book/application/dto/query-param/book-fields-query-params.dto';
import { BookFilterQueryParamsDto } from '@/module/book/application/dto/query-param/book-filter-query-params.dto';
import { UpdateBookDto } from '@/module/book/application/dto/update-book.dto';
import { CreateBookPolicyHandler } from '@/module/book/application/policy/create-book.policy-handler';
import { DeleteBookPolicyHandler } from '@/module/book/application/policy/delete-book.policy-handler';
import { ReadBookPolicyHandler } from '@/module/book/application/policy/read-book.policy-handler';
import { UpdateBookPolicyHandler } from '@/module/book/application/policy/update-book.policy-handler';
import { BookCrudUseCase } from '@/module/book/application/use-cases/book-crud.use-case';

@Controller('book')
@UseGuards(PolicyGuard)
@ApiTags('book')
export class BookController {
  constructor(private readonly crudUseCase: BookCrudUseCase) {}

  @Get()
  @Policies(ReadBookPolicyHandler)
  @GetAllSwaggerDecorator(
    BookDto,
    BookFilterQueryParamsDto,
    BookFieldsQueryParamsDto,
  )
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: BookFilterQueryParamsDto,
    @Query('fields') fields: BookFieldsQueryParamsDto,
    @Query('sort') sort: SortOptions<BookDto>,
  ): Promise<ManySerializedResponseDto<BookDto>> {
    return this.crudUseCase.getAll({
      page,
      filter,
      fields: fields.target,
      sort,
    });
  }

  @Get(':id')
  @Policies(ReadBookPolicyHandler)
  async getOneByIdOrFail(
    @Param('id') id: string,
  ): Promise<OneSerializedResponseDto<BookDto>> {
    return this.crudUseCase.getOneByIdOrFail(id);
  }

  @Post()
  @Policies(CreateBookPolicyHandler)
  async saveOne(
    @Body() createDto: CreateBookDto,
  ): Promise<OneSerializedResponseDto<BookDto>> {
    return this.crudUseCase.saveOne(createDto);
  }

  @Patch(':id')
  @Policies(UpdateBookPolicyHandler)
  async updateOneOrFail(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookDto,
  ): Promise<OneSerializedResponseDto<BookDto>> {
    return this.crudUseCase.updateOneOrFail(id, updateDto);
  }

  @Delete(':id')
  @Policies(DeleteBookPolicyHandler)
  async deleteOneOrFail(@Param('id') id: string): Promise<void> {
    return this.crudUseCase.deleteOneOrFail(id);
  }
}
