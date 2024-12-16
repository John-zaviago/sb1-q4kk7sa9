export interface AuthError {
  message: string;
  code?: string;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  storeName: string;
}

export interface LoginData {
  email: string;
  password: string;
}