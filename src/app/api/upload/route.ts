import { NextResponse } from "next/server";
import chalk from "chalk";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

import { r2 } from "@/app/lib/r2";
export async function POST(request: Request) {
  try {
    console.log(chalk.yellow("Generating an upload URL!"));

    const data = JSON.parse(await request.text());
    const extension = data.extension;

    const uniqueFilename =
      crypto.randomBytes(16).toString("hex") + "." + extension;

    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: uniqueFilename
      }),
      { expiresIn: 60 }
    );

    console.log(chalk.green("Success generating upload URL!"));

    return NextResponse.json({ url: signedUrl, uniqueFilename });
  } catch (err) {
    console.error("Error generating upload URL:", err);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
