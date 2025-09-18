// user.dto.ts
export class CreateUserDto {
  email: string
  password: string
  name: string
  phone?: string
}

export class LoginUserDto {
  email: string
  password: string
}

export class LoginWithPhoneDto {
  phone: string
  code: string
}

export class VerifyEmailDto {
  email: string
  code: string
}

export class VerifyPhoneDto {
  phone: string
  code: string
}
