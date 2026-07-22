import { InferSubjects } from '@casl/ability';
import { Author } from '@module/author/domain/author.entity';
import { Book } from '@module/book/domain/book.entity';
import { CartItem } from '@module/cart/domain/cart-item.entity';
import { Cart } from '@module/cart/domain/cart.entity';
import { Category } from '@module/category/domain/category.entity';
import { Genre } from '@module/genre/domain/genre.entity';
import { User } from '@module/iam/user/domain/user.entity';
import { Product } from '@module/product/domain/product.entity';
import { Store } from '@module/store/domain/store.entity';

export type AppSubjects =
  | InferSubjects<
      | typeof User
      | User
      | typeof Book
      | Book
      | typeof Author
      | Author
      | typeof Genre
      | Genre
      | typeof Product
      | Product
      | typeof Category
      | Category
      | typeof Store
      | Store
      | typeof Cart
      | Cart
      | typeof CartItem
      | CartItem
    >
  | 'all';
