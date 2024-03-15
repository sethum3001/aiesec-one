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
import Resource from "@/models/Resource";
import { errorResponse, successResponse } from "@/app/util/apiUtils";
import { ResourceDTO } from "@/app/dto/resourceDTO";
import { validate } from "class-validator";

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
      .collection(COLLECTIONS.RESOURCES)
      .findOne({ _id: new ObjectId(id) });

    if (resource) {
      return successResponse(SUCCESS_MESSAGES.RESOURCE_FETCHED, resource);
    } else {
      return errorResponse(
        ERROR_MESSAGES.RESOURCE_NOT_FOUND,
        null,
        HTTP_STATUS.NOT_FOUND
      );
    }
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.RESOURCES_FETCH_FAILED, error);
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
        ERROR_MESSAGES.RESOURCE_ID_INVALID,
        null,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    let resourceDTO = new ResourceDTO();

    (resourceDTO.title = title),
      (resourceDTO.url = url),
      (resourceDTO.description = description),
      (resourceDTO.link = link),
      (resourceDTO.functions = functions),
      (resourceDTO.keywords = keywords);

    const validationResults = await validate(resourceDTO);

    if (!validationResults[0]) {
      const db = (await clientPromise).db();

      // Update the document
      const result = await db.collection(COLLECTIONS.RESOURCES).updateOne(
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
        return successResponse(SUCCESS_MESSAGES.RESOURCE_UPDATED, { _id: id });
      } else {
        return errorResponse(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      }
    } else {
      return errorResponse(
        ERROR_MESSAGES.RESOURCE_VALIDATION_FAILED,
        validationResults,
        400
      );
    }
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.RESOURCE_UPDATE_FAILED, error);
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
        ERROR_MESSAGES.RESOURCE_ID_INVALID,
        null,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const db = (await clientPromise).db();

    // Delete the document
    const result = await db
      .collection(COLLECTIONS.RESOURCES)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      return successResponse(SUCCESS_MESSAGES.RESOURCE_DELETED);
    } else {
      return errorResponse(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.RESOURCE_DELETE_FAILED, error);
  }
};
