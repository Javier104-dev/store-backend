import { NotFoundException } from '@nestjs/common';

class StoreNotFoundException extends NotFoundException {
  constructor(error: string) {
    super(error);
  }
}

export default StoreNotFoundException;
