import { CategoryDto } from '@module/category/application/dto/category.dto';

import { FilterOptions } from '@common/base/get-all-options.interface';

export class CategoryFilterQueryParamsDto
  extends CategoryDto
  implements FilterOptions<CategoryDto> {}
