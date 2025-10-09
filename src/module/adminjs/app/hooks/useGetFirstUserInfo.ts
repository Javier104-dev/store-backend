import { UserCountDto } from '@module/iam/user/application/dto/user-count.dto';
import { useEffect, useState } from 'react';

import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';

import { axiosService } from '../config/axios';

type UserInfo = {
  count: number;
  isVerified: boolean;
};

export const useGetFirstUserInfo = (BASE_APP_URL: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  axiosService.setBaseUrl(BASE_APP_URL);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);

      const userStatus = await axiosService.get<boolean>('/user/status');
      const countResponse =
        await axiosService.get<OneSerializedResponseDto<UserCountDto>>(
          '/user/count',
        );
      const { count } = countResponse.data.attributes;

      setUserInfo({ count, isVerified: userStatus });
      setIsLoading(false);
    };
    fetch();
  }, []);

  return { ...userInfo, isLoading };
};
