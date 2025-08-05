export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  farmType: string;
  avatar?: string;
  isVerified: boolean;
  joinedDate: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  farmType: string;
}