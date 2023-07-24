import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse, AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as queryString from 'querystring';
import {
  IAuthenticationResponse,
  IUSerAuthenticationResponse,
} from './interfaces';
import { generateShortUuid } from 'custom-uuid';
import { ConfigService } from '@nestjs/config';
import { ISecret, VaultService } from '../vault/vault.service';
import {
  IErrorAuthorizationResponse,
  ISuccessAuthorizationResponse,
} from './interfaces/userAuthorizationResponse.interface';

@Injectable()
export class AuthenticationService {
  private readonly state = 'fixed_state_for_testing_reasons';
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly vaultService: VaultService,
  ) {}
  async requestAccessToken(): Promise<IAuthenticationResponse> {
    try {
      const client_id = this.config.get<string>('client_id');
      const client_secret = this.config.get<string>('client_secret');

      if (!client_id || !client_secret) {
        throw new HttpException(
          'Something went wrong. please contact the developer',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const data = {
        grant_type: 'client_credentials',
      };
      const response: AxiosResponse<IAuthenticationResponse> =
        await firstValueFrom(
          this.httpService.post('/api/token', queryString.stringify(data), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization:
                'Basic ' +
                Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            },
          }),
        );
      return response.data;
    } catch (error) {
      console.log(error);
      const typedError = error as AxiosError;
      throw new HttpException(
        {
          message: 'Authentication error.',
          detail: typedError.message,
          response: typedError.response.data,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  requestUserAuthorization() {
    const client_id = this.config.get<string>('client_id');
    const scope =
      'user-read-private user-read-email, user-read-currently-playing user-modify-playback-state user-read-playback-state';
    const redirect_uri =
      'http://localhost:3000/spotify/authentication/callback';

    return `https://accounts.spotify.com/authorize?${queryString.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: this.state,
    })}`;
  }

  async requestUserAccessToken(
    authorizationResponse:
      | ISuccessAuthorizationResponse
      | IErrorAuthorizationResponse,
  ) {
    const success = authorizationResponse as ISuccessAuthorizationResponse;
    if (success.code === undefined) {
      throw new HttpException(
        'An Error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const secret: ISecret = {
      state: authorizationResponse.state,
      code: (authorizationResponse as ISuccessAuthorizationResponse).code,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = this.vaultService.updateSecret(secret);
    if (updated === null) {
      this.vaultService.addSecret(secret);
    }

    const data = {
      grant_type: 'authorization_code',
      code: success.code,
      redirect_uri: 'http://localhost:3000/spotify/authentication/callback',
    };

    const client_id = this.config.get<string>('client_id');
    const client_secret = this.config.get<string>('client_secret');
    const urlPath = '/api/token';

    const response = await firstValueFrom(
      this.httpService.post<IUSerAuthenticationResponse>(
        urlPath,
        queryString.stringify(data),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
              'Basic ' +
              Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
          },
        },
      ),
    );

    if (response.status >= 200 && response.status < 300) {
      const { access_token, refresh_token, expires_in, scope } = response.data;
      secret.accessToken = access_token;
      secret.refreshToken = refresh_token;
      secret.expiresIn = expires_in;
      secret.scope = scope;
      this.vaultService.updateSecret(secret);
      return { message: 'You can close this now' };
    }
  }
}
