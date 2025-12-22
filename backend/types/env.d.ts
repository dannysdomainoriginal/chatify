declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    CLIENT_URL: string;
    
    PORT: string;
    MONGO_URI: string;
    JWT_SECRET: string;

    // resend sdk
    RESEND_API_KEY: string;
    EMAIL_FROM_NAME: string;
    REPLY_TO: string;

    // cloudinary
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;

    // arcjet
    ARCJET_KEY: string;
    ARCJET_ENV: string;
  }
}
