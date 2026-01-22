import { IsInt, Max, Min } from 'class-validator';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 6;

export class ProductsPageQueryParamsDto {
  @IsInt()
  @Min(1)
  number?: number = DEFAULT_PAGE_NUMBER;

  @IsInt()
  @Min(1)
  @Max(50)
  size?: number = DEFAULT_PAGE_SIZE;

  get offset(): number {
    return (this.number - 1) * this.size;
  }
}
