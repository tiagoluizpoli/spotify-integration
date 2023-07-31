import { Controller, Get } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller()
export class SpotifyController {
  constructor(private readonly service: SpotifyService) {}
  @Get('test')
  async test() {
    return await this.service.test();
  }
}
