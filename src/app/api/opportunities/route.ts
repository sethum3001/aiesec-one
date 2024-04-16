import clientPromise from "@/app/lib/mongodb";
import Opportunity from "@/models/Opportunities";
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

    const opportunities = await db
      .collection(COLLECTIONS.OPPORTUNITIES)
      .find({})
      .toArray();

    return successResponse(
      SUCCESS_MESSAGES.OPPORTUNITIES_FETCHED,
      opportunities
    );
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.OPPORTUNITIES_FETCH_FAILED, error);
  }
};

export const POST = async (req: Request) => {
  const { title, url, description, link, appLink } = await req.json();

  try {
    const db = (await clientPromise).db();

    const newOpportunity = new Opportunity({
      title,
      url,
      description,
      link,
      appLink
    });

    const result = await db
      .collection(COLLECTIONS.OPPORTUNITIES)
      .insertOne(newOpportunity);

    return createdResponse(SUCCESS_MESSAGES.OPPORTUNITY_CREATED, {
      _id: result.insertedId
    });
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.OPPORTUNITY_CREATE_FAILED, error);
  }
};
