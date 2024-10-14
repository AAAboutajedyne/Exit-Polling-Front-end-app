
export class User {
  id: number;
  email: string;
  admin: boolean;

  constructor({id, email, admin = false} : { id: number, email: string, admin?: boolean }) {
    this.id = id;
    this.email = email;
    this.admin = admin;
  }
}