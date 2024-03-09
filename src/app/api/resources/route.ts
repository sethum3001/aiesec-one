import clientPromise from "@/app/lib/mongodb";
import Resource from "@/models/Resource";
import {
  COLLECTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from "@/app/lib/constants";
import {
  createdResponse,
  errorResponse,
  successResponse
} from "@/app/util/apiUtils";

export const GET = async () => {
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
};

export const POST = async (req: Request) => {
  const { title, url, description, link, functions, keywords } =
    await req.json();

  try {
    const db = (await clientPromise).db();

    const newResource = new Resource({
      title,
      url,
      description,
      link,
      functions,
      keywords
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
};
