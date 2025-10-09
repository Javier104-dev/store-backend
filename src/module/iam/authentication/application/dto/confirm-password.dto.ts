import { IConfirmPasswordDto } from '@module/iam/authentication/application/dto/confirm-password.dto.interface';
import { IsNotEmpty } from 'class-validator';

export class ConfirmPasswordDto implements IConfirmPasswordDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  newPassword: string;
}
