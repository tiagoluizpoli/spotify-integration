import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AccessToken } from '@spotify/web-api-ts-sdk';

@Controller()
export class AuthenticationController {
  constructor(private readonly service: AuthenticationService) {}
  @Get('authenticate')
  async authenticate() {
    const response = await this.service.requestAccessToken();
    console.log(response);
    return response;
  }

  @Get('authorize')
  authorize() {
    return {
      url: this.service.requestUserAuthorization(),
    };
  }

  @Get('callback')
  callBack(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
  ) {
    console.log(code);
    console.log(state);
    console.log(error);
    if (code !== undefined) {
      return this.service.requestUserAccessToken({
        code: code,
        state: state,
      });
    }
    return { message: 'You can close this window now.' };
  }
  // @Post('callback')
  // callBack(@Body() body: AccessToken) {
  //   console.log(body);
  //   this.service.setTokens(body);
  //   return { message: 'You can close this window now.' };
  // }
}
