import { GetObjectCommand } from "@aws-sdk/client-s3";
import chalk from "chalk";

import { r2 } from "@/app/lib/r2";

export async function GET() {
  try {
    console.log(chalk.yellow("Retrieving cover image from R2!"));

    const pdf = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: "6755c85ff8ea7bd9956b73d4db14f439.jpg"
      })
    );

    if (!pdf) {
      throw new Error("pdf not found.");
    }

    return new Response(pdf.Body?.transformToWebStream(), {
      headers: {
        "Content-Type": "image/jpg"
      }
    });
  } catch (err) {
    console.log("error", err);
  }
}
