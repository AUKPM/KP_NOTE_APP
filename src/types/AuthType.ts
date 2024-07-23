export interface AuthType {
  accessToken: string;
  expiresAt: number;
  idToken: string;
  refreshToken: string;
  scope: string
  tokenType: string;
}
