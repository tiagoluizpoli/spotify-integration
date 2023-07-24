import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthenticationModule } from './authentication/authentication.module';
import { SharedHttpModule } from './shared-http/shared-http.module';
import { VaultModule } from './vault/vault.module';

@Module({
  imports: [AuthenticationModule, HttpModule, SharedHttpModule, VaultModule],
  providers: [SpotifyService],
  controllers: [SpotifyController],
  exports: [],
})
export class SpotifyModule {}
