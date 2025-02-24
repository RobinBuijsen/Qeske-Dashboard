import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      username: string;
      email: string;
      roleId: number;
      role: string;
    };
  }
}
