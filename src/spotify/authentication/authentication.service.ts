import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse, AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as queryString from 'querystring';
import { IAuthenticationResponse } from './interfaces';
import { generateShortUuid } from 'custom-uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}
  async RequestAccessToken(): Promise<IAuthenticationResponse> {
    try {
      // const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
      const SPOTIFY_CLIENT_ID = this.config.get<string>('client_id');
      const SPOTIFY_CLIENT_SECRET = this.config.get<string>('client_secret');
      console.log(SPOTIFY_CLIENT_ID);
      if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
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
                Buffer.from(
                  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
                ).toString('base64'),
            },
          }),
        );
      return response.data;
    } catch (error) {
      console.log(error);
      const typedError = error as AxiosError;
      throw new HttpException(
        {
          message: 'Authentication error',
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

  RequestUserAuthorization() {
    const state = generateShortUuid();
    console.log(state);
    const client_id = this.config.get<string>('client_id');
    console.log(client_id);
    const scope = 'user-read-private user-read-email';
    const redirect_uri =
      'http://localhost:3000/spotify/authentication/callback';
    return `https://accounts.spotify.com/authorize?${queryString.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    })}`;
  }
}
