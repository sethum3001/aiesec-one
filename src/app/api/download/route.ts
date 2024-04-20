import { GetObjectCommand } from "@aws-sdk/client-s3";
import chalk from "chalk";

import { r2Client } from "@/lib/r2Client";
import { errorResponse } from "@/util/apiUtils";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET() {
  console.log(chalk.yellow("Retrieving cover image from R2!"));

  const image = await r2Client.send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: "6755c85ff8ea7bd9956b73d4db14f439.jpg"
    })
  );

  if (!image) {
    return errorResponse(
      ERROR_MESSAGES.IMAGE_NOT_FOUND,
      undefined,
      HTTP_STATUS.NOT_FOUND
    );
  }

  try {
    return new NextResponse(image.Body?.transformToWebStream(), {
      headers: {
        "Content-Type": "image/jpg"
      }
    });
  } catch (err) {
    console.error("Error retrieving image:", err);
    return errorResponse(
      ERROR_MESSAGES.IMAGE_RETRIEVE_FAILED,
      err,
      HTTP_STATUS.SERVER_ERROR
    );
  }
}
