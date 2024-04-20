import clientPromise from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { COLLECTIONS, ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants";
import {
  createdResponse,
  errorResponse,
  successResponse
} from "@/util/apiUtils";
import { ResourceRequest } from "@/types/ResourceRequest";

export async function GET() {
  try {
    const db = (await clientPromise).db();

    const resources = await db
      .collection(COLLECTIONS.RESOURCES)
      .find({})
      .toArray();

    return successResponse(SUCCESS_MESSAGES.RESOURCES_FETCHED, resources);
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.RESOURCES_FETCH_FAILED, error);
  }
}

export async function POST(req: Request) {
  const resourceRequest: ResourceRequest = await req.json();
  console.log("Resource request: ", resourceRequest);

  try {
    const db = (await clientPromise).db();

    const newResource = new Resource({
      title: resourceRequest.title,
      description: resourceRequest.description,
      originalUrl: resourceRequest.originalUrl,
      shortLink: resourceRequest.shortLink,
      functions: resourceRequest.functions.split(","),
      keywords: resourceRequest.keywords.split(",")
    });

    const result = await db
      .collection(COLLECTIONS.RESOURCES)
      .insertOne(newResource);

    return createdResponse(SUCCESS_MESSAGES.RESOURCE_CREATED, {
      _id: result.insertedId
    });
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.RESOURCE_CREATE_FAILED, error);
  }
}
