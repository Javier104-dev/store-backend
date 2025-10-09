import { IForgotPasswordDto } from '@module/iam/authentication/application/dto/forgot-password.dto.interface';
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto implements IForgotPasswordDto {
  @IsNotEmpty()
  username: string;
}
