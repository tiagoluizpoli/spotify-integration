import { Controller, Get, Query } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller()
export class AuthenticationController {
  constructor(private readonly service: AuthenticationService) {}
  @Get('authenticate')
  async authenticate() {
    const response = await this.service.RequestAccessToken();
    console.log(response);
    return response;
  }

  @Get('authorize')
  authorize() {
    return {
      url: this.service.RequestUserAuthorization(),
    };
  }

  @Get('callback')
  callBack(@Query('code') code: string, @Query('state') state: string) {
    console.log(code);
    console.log(state);
    return { message: 'You can close this window now.' };
  }
}
