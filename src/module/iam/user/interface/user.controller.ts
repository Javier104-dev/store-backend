import { ReadUserPolicyHandler } from '@module/iam/authentication/application/policy/read-user-policy.handler';
import { AuthType } from '@module/iam/authentication/domain/auth-type.enum';
import { Auth } from '@module/iam/authentication/infrastructure/decorator/auth.decorator';
import { CurrentUser } from '@module/iam/authentication/infrastructure/decorator/current-user.decorator';
import { Policies } from '@module/iam/authorization/infrastructure/policy/decorator/policy.decorator';
import { UserFieldsQueryParamsDto } from '@module/iam/user/application/dto/user-fields-query-params.dto';
import { UserFilterQueryParamsDto } from '@module/iam/user/application/dto/user-filter-query-params.dto';
import { UserDto } from '@module/iam/user/application/dto/user.dto';
import { UserService } from '@module/iam/user/application/service/user.service';
import { User } from '@module/iam/user/domain/user.entity';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/query-param/page-query-params.dto';
import { SortOptions } from '@common/base/get-all-options.interface';
import { GetAllSwaggerDecorator } from '@common/base/interface/getAllSwaggerDecorator';

import { UserCountDto } from '../application/dto/user-count.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  @Get()
  @Policies(ReadUserPolicyHandler)
  @GetAllSwaggerDecorator(
    UserDto,
    UserFilterQueryParamsDto,
    UserFieldsQueryParamsDto,
  )
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: UserFilterQueryParamsDto,
    @Query('fields') fields: UserFieldsQueryParamsDto,
    @Query('sort') sort: SortOptions<UserDto>,
  ): Promise<ManySerializedResponseDto<UserDto>> {
    return this.userService.getAll({
      page,
      filter,
      sort,
      fields: fields.target,
    });
  }

  @Get('count')
  @Auth(AuthType.None)
  async getUsersCount(): Promise<OneSerializedResponseDto<UserCountDto>> {
    const count = await this.userService.getUsersCount();
    return this.responseAdapter.oneEntityResponse(User.getEntityName(), {
      count,
    });
  }

  @Get('status')
  @Auth(AuthType.None)
  async getUserStatus(): Promise<boolean> {
    return await this.userService.getUserStatus();
  }

  @Get('me')
  @Policies(ReadUserPolicyHandler)
  async getMe(
    @CurrentUser() user: User,
  ): Promise<OneSerializedResponseDto<UserDto>> {
    return this.responseAdapter.oneEntityResponse(
      User.getEntityName(),
      user as UserDto,
    );
  }
}
