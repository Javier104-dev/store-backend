import { IRefreshSessionDto } from '@module/iam/authentication/application/dto/refresh-session.dto.interface';
import { IsNotEmpty } from 'class-validator';

export class RefreshSessionDto implements IRefreshSessionDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  refreshToken: string;
}
