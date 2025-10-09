import { ISignUpDto } from '@module/iam/authentication/application/dto/sign-up.dto.interface';
import { IsNotEmpty } from 'class-validator';

export class SignUpDto implements ISignUpDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
