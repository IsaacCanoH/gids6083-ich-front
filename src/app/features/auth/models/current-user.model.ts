export interface CurrentUser {
  id: number;
  name: string;
  lastname: string;
  username: string;
  hash?: string | null;
  created_at: Date;
  iat: number;
  exp: number;
}
