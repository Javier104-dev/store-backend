import { AuthorDto } from '@module/author/application/dto/author.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateAuthorDto extends PartialType(AuthorDto) {}
