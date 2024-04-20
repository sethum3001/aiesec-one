import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/util/apiUtils";
import {
  COLLECTIONS,
  ERROR_MESSAGES,
  HTTP_STATUS,
  SHORT_LINK_PREFIXES,
  SUCCESS_MESSAGES
} from "@/lib/constants";
import clientPromise from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  context: { params: { type: string; shortLink: string } }
) {
  try {
    const { type, shortLink } = context.params;

    const db = (await clientPromise).db();

    // Opportunities redirection
    if (type == "opp") {
      const opportunity = await db
        .collection(COLLECTIONS.OPPORTUNITIES)
        .findOne({ shortLink: SHORT_LINK_PREFIXES.OPPORTUNITIES + shortLink });

      if (opportunity) {
        return successResponse(
          SUCCESS_MESSAGES.OPPORTUNITY_URL_FETCHED,
          opportunity.originalUrl
        );
      } else {
        return errorResponse(
          ERROR_MESSAGES.RESOURCE_NOT_FOUND,
          null,
          HTTP_STATUS.NOT_FOUND
        );
      }
    }

    // Resources redirection
    if (type == "r") {
      const resource = await db
        .collection(COLLECTIONS.RESOURCES)
        .findOne({ shortLink: SHORT_LINK_PREFIXES.RESOURCES + shortLink });

      if (resource) {
        return successResponse(
          SUCCESS_MESSAGES.RESOURCE_URL_FETCHED,
          resource.originalUrl
        );
      } else {
        return errorResponse(
          ERROR_MESSAGES.RESOURCE_NOT_FOUND,
          null,
          HTTP_STATUS.NOT_FOUND
        );
      }
    }
  } catch (error) {
    console.error(error);
    return errorResponse(ERROR_MESSAGES.URL_FETCH_FAILED, error);
  }
}
