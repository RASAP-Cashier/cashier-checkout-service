import { IsNotEmpty, Max, Min } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  cardNumber: number;

  @Min(0)
  @Max(12)
  @IsNotEmpty()
  month: number;

  @IsNotEmpty()
  year: number;
}
