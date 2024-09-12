import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { isValidId } from "@/util/dataUtils";
import {
  COLLECTIONS,
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES
} from "@/lib/constants";
import { errorResponse, successResponse } from "@/util/apiUtils";
import { uuid } from "uuidv4";
import Opportunity from "@/models/Opportunity";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2Client";

// GET request handler to fetch an opportunity by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } } // Extract `id` from the request context.
) {
  try {
    // Extract the dynamic parameter (id) from the path parameter
    const { id } = context.params;

    if (!isValidId(id)) {
      return errorResponse(
        ERROR_MESSAGES.OPPORTUNITY_ID_INVALID,
        null,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const db = (await clientPromise).db(); // Get a database connection

    // Convert the dynamic parameter to an ObjectId and query the database
    const opportunity = await db
      .collection(COLLECTIONS.OPPORTUNITIES)
      .findOne({ _id: new ObjectId(id) });

    if (opportunity) {
      return successResponse(SUCCESS_MESSAGES.OPPORTUNITY_FETCHED, opportunity); // Return success if found
    } else {
      return errorResponse(
        ERROR_MESSAGES.OPPORTUNITY_NOT_FOUND, // Return error if not found
        null,
        HTTP_STATUS.NOT_FOUND
      );
    }
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.OPPORTUNITY_FETCH_FAILED, error); // Handle server error
  }
}

// PUT request handler to update an opportunity by ID
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } } // Extract `id` from the request context
) {
  try {
    const { id } = context.params; // Extract ID from the context

    if (!isValidId(id)) {
      return errorResponse(
        ERROR_MESSAGES.OPPORTUNITY_ID_INVALID, // Return error if ID is invalid
        null,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const data = formData.get("data");
    let opportunityRequest = null;

    // Parse the data field into a JSON object
    if (data) {
      try {
        opportunityRequest = JSON.parse(data.toString());
      } catch (error) {
        console.error("Error parsing opportunityRequest data:", error);
        return errorResponse(
          ERROR_MESSAGES.OPPORTUNITY_CREATE_FAILED,
          error,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    const uniqueId = uuid(); // Generate a unique ID for file uploads
    const db = (await clientPromise).db(); // Get a database connection

    // Update the document
    const result = await db.collection(COLLECTIONS.OPPORTUNITIES).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: opportunityRequest.title,
          description: opportunityRequest.description,
          originalUrl: opportunityRequest.originalUrl,
          shortLink: opportunityRequest.shortLink,
          coverImageUrl: opportunityRequest?.coverImage
            ? await uploadFileToR2(file, uniqueId) // Upload file if available
            : null,
          deadline: opportunityRequest.deadline // Update deadline
        }
      }
    );

    if (result.modifiedCount > 0) {
      return successResponse(SUCCESS_MESSAGES.OPPORTUNITY_UPDATED, { _id: id }); // Return success if update succeeded
    } else {
      return errorResponse(ERROR_MESSAGES.OPPORTUNITY_NOT_FOUND); // Return error if document not found
    }
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.OPPORTUNITY_UPDATE_FAILED, error); // Handle server error
  }
}

// DELETE request handler to remove an opportunity by ID
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } } // Extract `id` from the request context
) {
  try {
    const { id } = context.params; // Extract ID from the context

    if (!isValidId(id)) {
      return errorResponse(
        ERROR_MESSAGES.OPPORTUNITY_ID_INVALID,
        null,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const db = (await clientPromise).db();

    // Delete the document
    const result = await db
      .collection(COLLECTIONS.OPPORTUNITIES)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      return successResponse(SUCCESS_MESSAGES.OPPORTUNITY_DELETED, { _id: id });
    } else {
      return errorResponse(ERROR_MESSAGES.OPPORTUNITY_NOT_FOUND);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.OPPORTUNITY_DELETE_FAILED, error);
  }
}

// Helper function to upload a file to R2 (S3-bucket service)
async function uploadFileToR2(file: File, uniqueId: string) {
  try {
    const bucketName = process.env.S3_BUCKET_NAME;
    const key = `${uniqueId}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: file.type
    });

    await r2Client.send(command);
    return `s3://${bucketName}/${key}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}
