import { FilterOptions } from '@common/base/get-all-options.interface';

import { StoreDto } from '../dto/store.dto';

export class StoreFilterQueryParamsDto
  extends StoreDto
  implements FilterOptions<StoreDto> {}
