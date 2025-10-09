import { GenreDto } from '@module/genre/application/dto/genre.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateGenreDto extends PartialType(GenreDto) {}
