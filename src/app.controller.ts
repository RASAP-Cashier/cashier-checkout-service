import { Body, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentDto } from './dto/payment.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'checkout_pay' })
  handlePay(@Body() paymentDto: PaymentDto) {
    return this.appService.checkout(paymentDto);
  }
}
