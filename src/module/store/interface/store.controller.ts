import { CurrentUser } from '@module/iam/authentication/infrastructure/decorator/current-user.decorator';
import { Policies } from '@module/iam/authorization/infrastructure/policy/decorator/policy.decorator';
import { PolicyGuard } from '@module/iam/authorization/infrastructure/policy/guard/policy.guard';
import { User } from '@module/iam/user/domain/user.entity';
import { CreateStoreDto } from '@module/store/application/dto/create-store.dto';
import { StoreDto } from '@module/store/application/dto/store.dto';
import { UpdateStoreDto } from '@module/store/application/dto/upate-store.dto';
import { CreateStorePolicyHandler } from '@module/store/application/policy/create-store.policy-handler';
import { DeleteStorePolicyHandler } from '@module/store/application/policy/delete-store.policy-handler';
import { ReadStorePolicyHandler } from '@module/store/application/policy/read-store.policy-handler';
import { UpdateStorePolicyHandler } from '@module/store/application/policy/update-store.policy-handler';
import { StoreFieldsQueryParamsDto } from '@module/store/application/query-param/store-fields-query-params.dto';
import { StoreFilterQueryParamsDto } from '@module/store/application/query-param/store-filter-query-params.dto';
import { StoreCrudUseCase } from '@module/store/application/use-cases/store-crud.use-case';
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

@Controller('store')
@UseGuards(PolicyGuard)
@ApiTags('store')
export class StoreController {
  constructor(private readonly crudUseCase: StoreCrudUseCase) {}

  @Get()
  @Policies(ReadStorePolicyHandler)
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: StoreFilterQueryParamsDto,
    @Query('fields') fields: StoreFieldsQueryParamsDto,
    @Query('sort') sort: SortOptions<StoreDto>,
  ): Promise<ManySerializedResponseDto<StoreDto>> {
    return this.crudUseCase.getAll({
      page,
      filter,
      fields: fields.target,
      sort,
    });
  }

  @Get('owner')
  @Policies(ReadStorePolicyHandler)
  async getStoreFronOwner(
    @CurrentUser() user: User,
  ): Promise<OneSerializedResponseDto<StoreDto>> {
    return this.crudUseCase.getStoreFronOwner(user);
  }

  @Get(':id')
  @Policies(ReadStorePolicyHandler)
  async getOneByIdOrFail(
    @Param('id') id: string,
  ): Promise<OneSerializedResponseDto<StoreDto>> {
    return this.crudUseCase.getOneByIdOrFail(id);
  }

  @Post()
  @Policies(CreateStorePolicyHandler)
  async saveOne(
    @Body() createDto: CreateStoreDto,
    @CurrentUser() user: User,
  ): Promise<OneSerializedResponseDto<StoreDto>> {
    return this.crudUseCase.createStore(createDto, user);
  }

  @Patch()
  @Policies(UpdateStorePolicyHandler)
  async updateOneOrFail(
    @Body() updateDto: UpdateStoreDto,
    @CurrentUser() user: User,
  ): Promise<OneSerializedResponseDto<StoreDto>> {
    return this.crudUseCase.updateStoreOrFail(updateDto, user);
  }

  @Delete(':id')
  @Policies(DeleteStorePolicyHandler)
  async deleteOneOrFail(@Param('id') id: string): Promise<void> {
    return this.crudUseCase.deleteOneOrFail(id);
  }
}
