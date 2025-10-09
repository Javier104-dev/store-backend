import { GenreDto } from '@module/genre/application/dto/genre.dto';

import { FilterOptions } from '@common/base/get-all-options.interface';

export class GenreFilterQueryParamsDto
  extends GenreDto
  implements FilterOptions<GenreDto> {}
