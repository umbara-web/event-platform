import { Role, User } from '@prisma/client';

export class UserBuilder {
  private data: User;

  constructor() {
    this.data = {
      id: 'user-' + Math.random(),
      email: 'user@test.com',
      password: 'hashed',
      firstName: 'Test',
      lastName: 'User',
      profileImage: null,
      role: Role.CUSTOMER,
      referralCode: 'REF123',
      referredById: null,
      isVerified: true,
      resetToken: null,
      resetTokenExp: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  withEmail(email: string) {
    this.data.email = email;
    return this;
  }

  asOrganizer() {
    this.data.role = Role.ORGANIZER;
    return this;
  }

  notVerified() {
    this.data.isVerified = false;
    return this;
  }

  build(): User {
    return this.data;
  }
}
