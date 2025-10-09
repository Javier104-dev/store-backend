import { AuthType } from '@module/iam/authentication/domain/auth-type.enum';
import { Auth } from '@module/iam/authentication/infrastructure/decorator/auth.decorator';
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @Auth(AuthType.None)
  async healthCheck(): Promise<{ status: string; uptime: number }> {
    return { status: 'ok', uptime: process.uptime() };
  }
}
