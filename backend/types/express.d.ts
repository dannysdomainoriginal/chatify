import "express";
import { UserI } from "@/models/User";

declare module "express-serve-static-core" {
  interface Request {
    user: UserI;
    customProperty: unknown;
  }
  
  interface Response {
    myLocals: {
      user?: string;
    };
  }
}
