import { StoreDto } from '@module/store/application/dto/store.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateStoreDto extends PartialType(StoreDto) {}
