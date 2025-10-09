import { IConfirmUserDto } from '@module/iam/authentication/application/dto/confirm-user.dto.interface';
import { IsNotEmpty } from 'class-validator';

export class ConfirmUserDto implements IConfirmUserDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  username: string;
}
