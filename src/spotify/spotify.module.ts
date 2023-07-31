import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthenticationModule } from './authentication/authentication.module';
import { SharedHttpModule } from './shared-http/shared-http.module';
import { VaultModule } from './vault/vault.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './shared-http/config/configuration';

@Module({
  imports: [
    AuthenticationModule,
    HttpModule,
    SharedHttpModule,
    VaultModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [SpotifyService],
  controllers: [SpotifyController],
  exports: [],
})
export class SpotifyModule {}
