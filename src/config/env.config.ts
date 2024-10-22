interface Environment {
  accessTokenSecret: string;
  accessTokenExpiration: string;
}

export const environment: Environment = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "fallback_secret",
  accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION ?? "1h"
};
