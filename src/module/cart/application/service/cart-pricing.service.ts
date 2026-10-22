import { CartItem } from '@module/cart/domain/cart-item.entity';
import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';

@Injectable()
export class CartPricingService {
  calculateSubtotal(items: CartItem[]): string {
    return items
      .reduce(
        (sum, item) =>
          sum.plus(this.calculateLineTotal(item.quantity, item.unitPrice)),
        new Decimal(0),
      )
      .toFixed(2);
  }

  calculateLineTotal(quantity: number, unitPrice: string): Decimal {
    return new Decimal(this.sanitizeString(unitPrice)).times(
      this.sanitizeQuantity(quantity),
    );
  }

  sanitizeString(value: string): string {
    const decimal = new Decimal(value);
    return decimal.isFinite() ? value : '0';
  }

  sanitizeQuantity = (value: number): number => {
    return Number.isFinite(value) && value > 0 ? value : 0;
  };
}
