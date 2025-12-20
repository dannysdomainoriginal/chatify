import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
    };
    customProperty: unknown;
  }
  
  interface Response {
    myLocals: {
      user?: string;
    };
  }
}
