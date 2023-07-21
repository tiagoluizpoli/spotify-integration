import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyModule } from './spotify/spotify.module';
import { RouterModule } from '@nestjs/core';
import { AuthenticationModule } from './spotify/authentication/authentication.module';
import { SharedHttpModule } from './spotify/shared-http/shared-http.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: '/spotify',
        module: SpotifyModule,
        children: [
          {
            path: 'authentication',
            module: AuthenticationModule,
          },
        ],
      },
    ]),
    SpotifyModule,
    SharedHttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
