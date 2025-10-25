import { FilterOptions } from '@common/base/get-all-options.interface';

import { CategoryDto } from '../category.dto';

export class CategoryFilterQueryParamsDto
  extends CategoryDto
  implements FilterOptions<CategoryDto> {}
