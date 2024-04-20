import { NextResponse } from "next/server";
import { HTTP_STATUS } from "@/lib/constants";

/**
 * Utility function to send a common success response object.
 * @param {string} message - The success message.
 * @param {any} data - The data to include in the response.
 * @param {number} [status=HTTP_STATUS.SUCCESS] - The HTTP status code. Defaults to HTTP_STATUS.SUCCESS.
 * @returns {NextResponse} - The Next.js response object.
 */
export function successResponse(
  message: string,
  data: any = null,
  status: number = HTTP_STATUS.SUCCESS
): NextResponse {
  return NextResponse.json(
    {
      message,
      data
    },
    { status }
  );
}

/**
 * Utility function to send a common created response object.
 * @param {string} message - The success message.
 * @param {any} data - The data to include in the response.
 * @returns {NextResponse} - The Next.js response object.
 */
export function createdResponse(
  message: string,
  data: any = null
): NextResponse {
  return successResponse(message, data, HTTP_STATUS.CREATED);
}

/**
 * Utility function to send a common error response object.
 * @param {string} message - The error message.
 * @param {any} error - The error details to include in the response.
 * @param {number} [status=HTTP_STATUS.SERVER_ERROR] - The HTTP status code. Defaults to HTTP_STATUS.SERVER_ERROR.
 * @returns {NextResponse} - The Next.js response object.
 */
export function errorResponse(
  message: string,
  error: any = null,
  status: number = HTTP_STATUS.SERVER_ERROR
): NextResponse {
  return NextResponse.json(
    {
      message,
      error
    },
    { status }
  );
}
