interface IBaseAuthorizationResponse {
  state: string;
}

export interface ISuccessAuthorizationResponse
  extends IBaseAuthorizationResponse {
  code: string;
}

export interface IErrorAuthorizationResponse
  extends IBaseAuthorizationResponse {
  error: string;
}
