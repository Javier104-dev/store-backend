import { PartialType } from '@nestjs/swagger';

import { StoreDto } from './store.dto';

export class UpdateStoreDto extends PartialType(StoreDto) {}
