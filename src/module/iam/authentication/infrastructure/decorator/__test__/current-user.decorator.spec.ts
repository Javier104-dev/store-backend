import { REQUEST_USER_KEY } from '@module/iam/authentication/authentication.constants';
import { CurrentUser } from '@module/iam/authentication/infrastructure/decorator/current-user.decorator';
import { User } from '@module/iam/user/domain/user.entity';
import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { Request } from 'express';

describe('@CurrentUser', () => {
  const user = {
    id: '00000000-0000-0000-0000-000000000000',
    username: '_test_john@biggertech.co',
  } as User;

  const request = {
    [REQUEST_USER_KEY]: user,
  } as Request & { user?: User };

  const executionContext = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;

  it('should enhance parameter with "user"', () => {
    class Test {
      test(
        @CurrentUser()
        user: User,
      ) {
        return user;
      }
    }

    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    const key = Object.keys(metadata)[0];
    const currentUserFactory = metadata[key].factory;
    const result = currentUserFactory(undefined, executionContext);

    expect(result).toEqual(request.user);
  });

  it('should enhance parameter with a specific attribute of "user"', () => {
    class Test {
      test(
        @CurrentUser('id')
        id: string,
      ) {
        return id;
      }
    }

    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    const key = Object.keys(metadata)[0];
    const currentUserFactory = metadata[key].factory;
    const result = currentUserFactory('id', executionContext);

    expect(result).toEqual(request.user.id);
  });
});
