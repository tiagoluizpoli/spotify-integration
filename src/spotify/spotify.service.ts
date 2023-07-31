import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { VaultService } from './vault/vault.service';
import { AuthenticationService } from './authentication/authentication.service';

@Injectable()
export class SpotifyService {
  private sdk: SpotifyApi;
  constructor(
    private readonly config: ConfigService,
    private readonly vaut: VaultService,
    private readonly authentication: AuthenticationService,
  ) {
    this.sdk = authentication.getSdk();
  }

  async test() {
    // await this.authentication.authenticate();
    return await this.sdk.player.getCurrentlyPlayingTrack();
  }
}
