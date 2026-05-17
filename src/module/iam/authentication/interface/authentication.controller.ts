import { ConfirmPasswordDto } from '@module/iam/authentication/application/dto/confirm-password.dto';
import { ConfirmUserDto } from '@module/iam/authentication/application/dto/confirm-user.dto';
import { ForgotPasswordDto } from '@module/iam/authentication/application/dto/forgot-password.dto';
import { IRefreshSessionResponse } from '@module/iam/authentication/application/dto/refresh-session-response.interface';
import { RefreshSessionDto } from '@module/iam/authentication/application/dto/refresh-session.dto';
import { ResendConfirmationCodeDto } from '@module/iam/authentication/application/dto/resend-confirmation-code.dto';
import { ISignInResponse } from '@module/iam/authentication/application/dto/sign-in-response.interface';
import { SignInDto } from '@module/iam/authentication/application/dto/sign-in.dto';
import { SignUpDto } from '@module/iam/authentication/application/dto/sign-up.dto';
import { CreateUserPolicyHandler } from '@module/iam/authentication/application/policy/create-user-policy.handler';
import { AuthenticationService } from '@module/iam/authentication/application/service/authentication.service';
import { AuthType } from '@module/iam/authentication/domain/auth-type.enum';
import { Auth } from '@module/iam/authentication/infrastructure/decorator/auth.decorator';
import { AppRole } from '@module/iam/authorization/domain/app-role.enum';
import { Policies } from '@module/iam/authorization/infrastructure/policy/decorator/policy.decorator';
import { PolicyGuard } from '@module/iam/authorization/infrastructure/policy/guard/policy.guard';
import { UserDto } from '@module/iam/user/application/dto/user.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { ISuccessfulOperationResponse } from '@common/base/application/dto/successful-operation-response.interface';

@Controller('auth')
@ApiTags('auth')
@Auth(AuthType.None)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  async handleSignUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<OneSerializedResponseDto<UserDto>> {
    return this.authenticationService.handleAdminSignUp(signUpDto);
  }

  @Post('create-regular')
  async handleSignupRegular(
    @Body() signUpDto: SignUpDto,
  ): Promise<OneSerializedResponseDto<UserDto>> {
    return this.authenticationService.handleSignUp(signUpDto, [
      AppRole.Regular,
    ]);
  }

  @Post('create')
  @Auth(AuthType.Bearer)
  @UseGuards(PolicyGuard)
  @Policies(CreateUserPolicyHandler)
  async handleSignup(
    @Body() signUpDto: SignUpDto,
  ): Promise<OneSerializedResponseDto<UserDto>> {
    return this.authenticationService.handleSignUp(signUpDto, [AppRole.Admin]);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async handleSignIn(
    @Body() signInDto: SignInDto,
  ): Promise<OneSerializedResponseDto<ISignInResponse>> {
    return this.authenticationService.handleSignIn(signInDto);
  }

  @Post('confirm-user')
  @HttpCode(HttpStatus.OK)
  async handleConfirmUser(
    @Body() confirmUserDto: ConfirmUserDto,
  ): Promise<OneSerializedResponseDto<ISuccessfulOperationResponse>> {
    return this.authenticationService.handleConfirmUser(confirmUserDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async handleForgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<OneSerializedResponseDto<ISuccessfulOperationResponse>> {
    return this.authenticationService.handleForgotPassword(forgotPasswordDto);
  }

  @Post('confirm-password')
  @HttpCode(HttpStatus.OK)
  async handleConfirmPassword(
    @Body() confirmPasswordDto: ConfirmPasswordDto,
  ): Promise<OneSerializedResponseDto<ISuccessfulOperationResponse>> {
    return this.authenticationService.handleConfirmPassword(confirmPasswordDto);
  }

  @Post('resend-confirmation-code')
  @HttpCode(HttpStatus.OK)
  async handleResendConfirmationCode(
    @Body() resendConfirmationCode: ResendConfirmationCodeDto,
  ): Promise<OneSerializedResponseDto<ISuccessfulOperationResponse>> {
    return this.authenticationService.handleResendConfirmationCode(
      resendConfirmationCode,
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async handleRefreshSession(
    @Body() refreshSessionDto: RefreshSessionDto,
  ): Promise<OneSerializedResponseDto<IRefreshSessionResponse>> {
    return this.authenticationService.handleRefreshSession(refreshSessionDto);
  }
}
