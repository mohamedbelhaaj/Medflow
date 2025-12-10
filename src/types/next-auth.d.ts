import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name?: string
    role: string
    firstName?: string
    lastName?: string
    tenantId?: string
    tenantName?: string
    clinicId?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string
      role: string
      firstName?: string
      lastName?: string
      tenantId?: string
      tenantName?: string
      clinicId?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    firstName?: string
    lastName?: string
    tenantId?: string
    tenantName?: string
    clinicId?: string
  }
}