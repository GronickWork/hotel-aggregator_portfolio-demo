export interface createUserDto {
  name: string;
  passwordHash: string;
  email: string;
  contactPhone: string;
  role: 'client' | 'admin' | 'manager';
  whoCreate: 'self' | 'admin';
}
