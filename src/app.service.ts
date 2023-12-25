import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentDto } from './dto/payment.dto';
import Checkout from 'checkout-sdk-node';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface CheckoutAccessToken {
  access_token: string;
  token_type: string;
}

@Injectable()
export class AppService {
  private checkoutService: Checkout;
  constructor(private readonly httpService: HttpService) {
    this.checkoutService = new Checkout(process.env.CHECKOUT_SECRET, {
      client: process.env.CHECKOUT_ACCESS_KEY,
      pk: process.env.CHECKOUT_ACCESS_ID,
      scope: ['gateway'],
      environment: process.env.CHECKOUT_ENV,
    });
  }

  async accessToken() {
    try {
      const token = this.checkoutService.access.request({
        grant_type: 'client_credentials',
        client_id: process.env.CHECKOUT_ACCESS_KEY,
        scope: 'gateway',
        processing_channel_id: process.env.CHECKOUT_PROCESSING_ID,
        client_secret: process.env.CHECKOUT_CLIENT_SECRET_ID,
        environment: process.env.CHECKOUT_ENV,
      });

      return token;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async checkout(payment: PaymentDto) {
    try {
      const accessToken = (await this.accessToken()) as CheckoutAccessToken;
      const reqToken: any = await firstValueFrom(
        this.httpService.post(
          process.env.CHECKOUT_BASE_URL,
          {
            source: {
              // to  be implemented
              type: 'card',
              number: payment.cardNumber,
              expiry_month: payment.month,
              expiry_year: payment.year,
            },
            token: `Bearer ${accessToken.access_token}`,
            processing_channel_id: process.env.CHECKOUT_PROCESSING_ID,
            // requires implementation
            reference: '111',
            amount: payment.amount * 100,
            currency: payment.currency,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken.access_token}`,
            },
          },
        ),
      );

      return reqToken.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }
}
