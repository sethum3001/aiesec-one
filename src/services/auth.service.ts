import { SignJWT, jwtVerify, errors } from "jose";
import { USER_TYPE } from "@/constants/common.constants";
import { environment } from "../config/env.config";

const generateAccessToken = async (
  userId: string,
  userType: string
): Promise<string> => {
  const secret = new TextEncoder().encode(environment.accessTokenSecret);
  const token = await new SignJWT({ userId, userType })
    .setProtectedHeader({ alg: "HS256" }) // Set the signing algorithm
    .setExpirationTime(environment.accessTokenExpiration) // Set expiration
    .sign(secret); // Sign the token with the secret key

  return token;
};

// Function to verify an access token
const verifyAccessToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(environment.accessTokenSecret);
    const {
      payload: { userType }
    } = await jwtVerify(token, secret); // Verify the token and get the payload
    return userType; // Return the decoded token
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      return { decodedToken: null, error: "expired" }; // Handle expired token
    }
    return { decodedToken: null, error: "invalid" }; // Handle invalid token
  }
};

export default {
  generateAccessToken,
  verifyAccessToken
};
