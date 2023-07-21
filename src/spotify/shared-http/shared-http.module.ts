import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SharedHttpService } from './shared-http.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        baseURL: 'https://accounts.spotify.com',
      }),
    }),
  ],
  providers: [SharedHttpService],
  exports: [HttpModule],
})
export class SharedHttpModule {}
