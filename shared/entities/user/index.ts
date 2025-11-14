import { z } from "zod";
import { ApiError } from "../api/apiError.ts";

export class User {
  private _id: string;
  private _email: string;
  private _firstName: string;
  private _lastName: string;

  constructor({
    email,
    firstName,
    lastName,
    id,
  }: {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
  }) {
    this._id = User.idSchema.optional().parse(id) ?? crypto.randomUUID();
    this._email = User.emailSchema.parse(email);
    this._firstName = User.firstNameSchema.parse(firstName);
    this._lastName = User.lastNameSchema.parse(lastName);
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  static async login({
    email,
    password,
  }: {
    email: TEmail;
    password: TPassword;
  }): Promise<User> {
    const parsedEmail = this.emailSchema.parse(email);
    const parsedPassword = this.passwordSchema.parse(password);

    const body = { email: parsedEmail, password: parsedPassword };

    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      const apiError = ApiError.parse(data);
      throw new Error(apiError.message);
    }

    const parsed = User.schema.parse(data);

    return new User({
      id: parsed.id,
      email: parsed.email,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
    });
  }

  async logout(): Promise<void> {
    const res = await fetch("/api/v1/auth/logout", {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      const apiError = ApiError.parse(data);
      throw new Error(apiError.message);
    }

    // TODO: Add response handling if needed

    this.dispose();
  }

  private dispose(): void {
    this._id = "";
    this._email = "";
    this._firstName = "";
    this._lastName = "";
  }

  static get loginSchema() {
    return z.object({
      email: this.emailSchema,
      password: this.passwordSchema,
    });
  }

  static get logoutSchema() {
    return z.string().min(1, "Logout token is required");
  }

  static get emailSchema() {
    return z.email("Invalid email address");
  }

  static get passwordSchema() {
    return z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      );
  }

  static get firstNameSchema() {
    return z.string().min(1, "First name is required");
  }

  static get lastNameSchema() {
    return z.string().min(1, "Last name is required");
  }

  static get idSchema() {
    return z.uuid("Invalid UUID format for ID");
  }

  static get schema() {
    return z.object({
      id: this.idSchema,
      email: this.emailSchema,
      firstName: this.firstNameSchema,
      lastName: this.lastNameSchema,
    });
  }

  toJSON() {
    return {
      id: this._id,
      email: this._email,
      firstName: this._firstName,
      lastName: this._lastName,
    };
  }
}

export type TPassword = z.infer<typeof User.passwordSchema>;
export type TEmail = z.infer<typeof User.emailSchema>;
export type TFirstName = z.infer<typeof User.firstNameSchema>;
export type TLastName = z.infer<typeof User.lastNameSchema>;
export type TUserId = z.infer<typeof User.idSchema>;
export type TUser = z.infer<typeof User.schema>;
