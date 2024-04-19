import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { isValidId } from "@/app/util/dataUtils";
import {
  COLLECTIONS,
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES
} from "@/app/lib/constants";
import Opportunity from "@/models/Opportunity";
import { errorResponse, successResponse } from "@/app/util/apiUtils";
import opportunity from "@/models/Opportunity";

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    // Extract the dynamic parameter (id) from the path parameter
    const { id } = context.params;

    if (!isValidId(id)) {
      return errorResponse(
        ERROR_MESSAGES.RESOURCE_ID_INVALID,
        null,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const db = (await clientPromise).db();

    // Convert the dynamic parameter to an ObjectId and query the database
    const resource = await db
      .collection(COLLECTIONS.OPPORTUNITIES)
      .findOne({ _id: new ObjectId(id) });

    if (resource) {
      return successResponse(SUCCESS_MESSAGES.OPPORTUNITY_FETCHED, opportunity);
    } else {
      return errorResponse(
        ERROR_MESSAGES.OPPORTUNITY_NOT_FOUND,
        null,
        HTTP_STATUS.NOT_FOUND
      );
    }
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.OPPORTUNITY_FETCH_FAILED, error);
  }
};

export const PUT = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const { id } = context.params;
    const { title, url, description, link, functions, keywords } =
      await req.json();

    if (!isValidId(id)) {
      return errorResponse(
        ERROR_MESSAGES.OPPORTUNITY_ID_INVALID,
        null,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const db = (await clientPromise).db();

    // Update the document
    const result = await db.collection(COLLECTIONS.OPPORTUNITIES).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          url,
          description,
          link,
          functions,
          keywords
        }
      }
    );

    if (result.modifiedCount > 0) {
      return successResponse(SUCCESS_MESSAGES.OPPORTUNITY_UPDATED, { _id: id });
    } else {
      return errorResponse(ERROR_MESSAGES.OPPORTUNITY_NOT_FOUND);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.OPPORTUNITY_UPDATE_FAILED, error);
  }
};

export const DELETE = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const { id } = context.params;

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
      return successResponse(SUCCESS_MESSAGES.OPPORTUNITY_DELETED);
    } else {
      return errorResponse(ERROR_MESSAGES.OPPORTUNITY_NOT_FOUND);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.OPPORTUNITY_DELETE_FAILED, error);
  }
};
