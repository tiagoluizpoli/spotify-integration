export interface IAuthenticationResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IUSerAuthenticationResponse extends IAuthenticationResponse {
  refresh_token: string;
  scope: string;
}
