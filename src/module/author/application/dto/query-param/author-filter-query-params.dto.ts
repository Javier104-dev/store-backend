import { AuthorDto } from '@module/author/application/dto/author.dto';

import { FilterOptions } from '@common/base/get-all-options.interface';

export class AuthorFilterQueryParamsDto
  extends AuthorDto
  implements FilterOptions<AuthorDto> {}
