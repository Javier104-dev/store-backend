import { IsInt, Min } from 'class-validator';

const DEFAULT_PAGE_SIZE = 5;

export class ProductsQueryParamsDto {
  @IsInt()
  @Min(1)
  productsLimit?: number = DEFAULT_PAGE_SIZE;
}
