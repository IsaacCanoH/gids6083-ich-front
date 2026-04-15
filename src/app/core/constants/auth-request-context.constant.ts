import { HttpContextToken } from '@angular/common/http';

export type AuthRequestType = 'none' | 'login' | 'refresh' | 'logout' | 'me';

export const AUTH_REQUEST_TYPE = new HttpContextToken<AuthRequestType>(() => 'none');
