// src/auth/dto/authenticated-user.dto.ts
export class AuthenticatedUserDto {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
}
