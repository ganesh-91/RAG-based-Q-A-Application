export class RegisterDto {
  email: string;
  password: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}
