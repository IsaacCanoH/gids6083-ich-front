import { CurrentUser } from '../../features/auth/models/current-user.model';

export interface AuthState {
  isAuthenticated: boolean;
  user: CurrentUser | null;
  isLoading: boolean;
}
