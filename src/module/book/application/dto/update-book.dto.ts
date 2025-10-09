import { BookDto } from '@module/book/application/dto/book.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateBookDto extends PartialType(BookDto) {}
