import { IConfirmPasswordDto } from '@module/iam/authentication/application/dto/confirm-password.dto.interface';
import { IConfirmUserDto } from '@module/iam/authentication/application/dto/confirm-user.dto.interface';
import { IForgotPasswordDto } from '@module/iam/authentication/application/dto/forgot-password.dto.interface';
import { IRefreshSessionResponse } from '@module/iam/authentication/application/dto/refresh-session-response.interface';
import { IRefreshSessionDto } from '@module/iam/authentication/application/dto/refresh-session.dto.interface';
import { IResendConfirmationCodeDto } from '@module/iam/authentication/application/dto/resend-confirmation-code.dto.interface';
import { ISignInResponse } from '@module/iam/authentication/application/dto/sign-in-response.interface';
import { ISignInDto } from '@module/iam/authentication/application/dto/sign-in.dto.interface';
import { ISignUpDto } from '@module/iam/authentication/application/dto/sign-up.dto.interface';
import {
  USER_ALREADY_CONFIRMED_ERROR,
  USER_ALREADY_SIGNED_UP_ERROR,
} from '@module/iam/authentication/application/exception/authentication-exception-messages';
import { UserAlreadyConfirmed } from '@module/iam/authentication/application/exception/user-already-confirmed.exception';
import { UserAlreadySignedUp } from '@module/iam/authentication/application/exception/user-already-signed-up.exception';
import {
  IDENTITY_PROVIDER_SERVICE_KEY,
  IIdentityProviderService,
} from '@module/iam/authentication/application/service/identity-provider.service.interface';
import { AUTHENTICATION_NAME } from '@module/iam/authentication/domain/authentication.name';
import { AppRole } from '@module/iam/authorization/domain/app-role.enum';
import { UserDto } from '@module/iam/user/application/dto/user.dto';
import { UserService } from '@module/iam/user/application/service/user.service';
import { User } from '@module/iam/user/domain/user.entity';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { ISuccessfulOperationResponse } from '@common/base/application/dto/successful-operation-response.interface';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(IDENTITY_PROVIDER_SERVICE_KEY)
    private readonly identityProviderService: IIdentityProviderService,
    private readonly userService: UserService,
    private readonly mapper: DtoMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async handleAdminSignUp(
    signUpDto: ISignUpDto,
  ): Promise<OneSerializedResponseDto<UserDto>> {
    const { username, password } = signUpDto;
    const existingUser = await this.userService.getOneByUsername(username);
    const userCount = await this.userService.getUsersCount();

    if (!existingUser && userCount === 0) {
      return this.signUpAndSave(username, password, [AppRole.SuperAdmin]);
    } else if (existingUser && !existingUser.externalId && userCount === 1) {
      return this.signUpAndSave(
        username,
        password,
        [AppRole.SuperAdmin],
        existingUser.id,
      );
    } else {
      throw new ForbiddenException(
        "Sign-up disabled: 'user' table is not empty",
      );
    }
  }

  async handleSignUp(
    signUpDto: ISignUpDto,
    roles: AppRole[],
  ): Promise<OneSerializedResponseDto<UserDto>> {
    const { username, password } = signUpDto;

    const existingUser = await this.userService.getOneByUsername(username);

    if (!existingUser) {
      return this.signUpAndSave(username, password, roles);
    }

    if (!existingUser.externalId) {
      return this.signUpAndSave(username, password, roles, existingUser.id);
    }

    throw new UserAlreadySignedUp({
      message: USER_ALREADY_SIGNED_UP_ERROR,
      pointer: '/user/externalId',
    });
  }

  async handleSignIn(
    signInDto: ISignInDto,
  ): Promise<OneSerializedResponseDto<ISignInResponse>> {
    const { username, password } = signInDto;
    const existingUser =
      await this.userService.getOneByUsernameOrFail(username);

    const response = await this.identityProviderService.signIn(
      existingUser.username,
      password,
    );

    return this.responseAdapter.oneEntityResponse<ISignInResponse>(
      AUTHENTICATION_NAME,
      response,
    );
  }

  async handleConfirmUser(
    confirmUserDto: IConfirmUserDto,
  ): Promise<OneSerializedResponseDto<ISuccessfulOperationResponse>> {
    const { username, code } = confirmUserDto;
    const existingUser =
      await this.userService.getOneByUsernameOrFail(username);

    if (existingUser.isVerified) {
      throw new UserAlreadyConfirmed({
        message: USER_ALREADY_CONFIRMED_ERROR,
        pointer: '/user/isVerified',
      });
    }

    const confirmUserResponse = await this.identityProviderService.confirmUser(
      existingUser.username,
      code,
    );

    await this.userService.updateOneOrFail(existingUser.id, {
      isVerified: true,
    });

    return this.responseAdapter.oneEntityResponse<ISuccessfulOperationResponse>(
      AUTHENTICATION_NAME,
      confirmUserResponse,
    );
  }

  async handleForgotPassword(
    forgotPasswordDto: IForgotPasswordDto,
  ): Promise<OneSerializedResponseDto<ISuccessfulOperationResponse>> {
    const { username } = forgotPasswordDto;
    const existingUser =
      await this.userService.getOneByUsernameOrFail(username);

    const response = await this.identityProviderService.forgotPassword(
      existingUser.username,
    );

    return this.responseAdapter.oneEntityResponse<ISuccessfulOperationResponse>(
      AUTHENTICATION_NAME,
      response,
    );
  }

  async handleConfirmPassword(
    confirmPasswordDto: IConfirmPasswordDto,
  ): Promise<OneSerializedResponseDto<ISuccessfulOperationResponse>> {
    const { username, newPassword, code } = confirmPasswordDto;
    const existingUser =
      await this.userService.getOneByUsernameOrFail(username);

    const response = await this.identityProviderService.confirmPassword(
      existingUser.username,
      newPassword,
      code,
    );

    return this.responseAdapter.oneEntityResponse<ISuccessfulOperationResponse>(
      AUTHENTICATION_NAME,
      response,
    );
  }

  async handleResendConfirmationCode(
    resendConfirmationCodeDto: IResendConfirmationCodeDto,
  ): Promise<OneSerializedResponseDto<ISuccessfulOperationResponse>> {
    const { username } = resendConfirmationCodeDto;
    const existingUser =
      await this.userService.getOneByUsernameOrFail(username);

    const response = await this.identityProviderService.resendConfirmationCode(
      existingUser.username,
    );

    return this.responseAdapter.oneEntityResponse<ISuccessfulOperationResponse>(
      AUTHENTICATION_NAME,
      response,
    );
  }

  async handleRefreshSession(
    refreshSessionDto: IRefreshSessionDto,
  ): Promise<OneSerializedResponseDto<IRefreshSessionResponse>> {
    const { username, refreshToken } = refreshSessionDto;
    const existingUser =
      await this.userService.getOneByUsernameOrFail(username);

    const response = await this.identityProviderService.refreshSession(
      existingUser.username,
      refreshToken,
    );

    return this.responseAdapter.oneEntityResponse<IRefreshSessionResponse>(
      AUTHENTICATION_NAME,
      response,
    );
  }

  private async signUpAndSave(
    username: string,
    password: string,
    roles: AppRole[],
    userId?: string,
  ): Promise<OneSerializedResponseDto<UserDto>> {
    let userToSaveId = userId;

    if (!userToSaveId) {
      userToSaveId = (await this.userService.saveOne(new User(username, roles)))
        .id;
    }

    const { externalId } = await this.identityProviderService.signUp(
      username,
      password,
    );

    const user = await this.userService.updateOneOrFail(userToSaveId, {
      externalId,
    });

    const map = this.mapper.fromEntity<UserDto>(user);
    return this.responseAdapter.oneEntityResponse<UserDto>(
      User.getEntityName(),
      map,
    );
  }
}
