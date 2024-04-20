import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      role: string | undefined | null;
      entity: string | undefined | null;
    } & DefaultSession["user"];
  }
}
