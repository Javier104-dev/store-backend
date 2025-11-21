import { StoreDto } from '@module/store/application/dto/store.dto';

import { FilterOptions } from '@common/base/get-all-options.interface';

export class StoreFilterQueryParamsDto
  extends StoreDto
  implements FilterOptions<StoreDto> {}
