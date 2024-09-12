export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/"] // The matcher applies the middleware to the root ("/") path, protects the homepage.
};
