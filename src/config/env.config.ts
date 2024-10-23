interface Environment {
  accessTokenSecret: string;
  accessTokenExpiration: string;
}

export const environment: Environment = {
  accessTokenSecret:
    process.env.ACCESS_TOKEN_SECRET ??
    "oIyboLnPO_veSZHUW2xRTD8CvsYDHUmg66gOyc6x2SA",
  accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION ?? "24h"
};
