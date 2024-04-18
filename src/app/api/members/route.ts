import { NextApiRequest, NextApiResponse } from "next";
import { GraphQLClient } from "graphql-request";
import dbConnect from "@/app/lib/dbConnect";
import Member, { iMember, insertMembersIfNotExist } from "@/models/Member";
import { requestGraphQL } from "@/app/util/graphql";
import { json } from "body-parser";
import { NextRequest, NextResponse } from "next/server";
import { Resolver } from "dns";

// Custom middleware function to parse JSON request bodies
const jsonParser = json();

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false
  }
};

// Function to fetch data from the GraphQL API

export async function fetchDataFromGraphQL(expaIds: string[]) {
  const results = [];

  try {
    //console.log("Received expaIds:", expaIds);

    // Fetch data for each expaId
    for (const id of expaIds) {
      const query = `
        query GetPersonDetails($id: ID!) {
          getPerson(id: $id) {
            id
            full_name
            gender
            created_at
            home_lc {
              name
            }
            member_positions {
              function {
                name
              }
              start_date
              end_date
              office {
                name
              }
              role {
                name
              }
              committee_department {
                name
              }
            }
          }
        }
      `;

      //const data = await client.request(query, { id });
      const variables = { id };
      const data = await requestGraphQL(query, variables);
      // Extract the 'getPerson' data from the response
      const person = data.getPerson;

      if (person) {
        results.push(person);
      } else {
        console.warn(`Person with id ${id} not found.`);
      }
    }

    return results; // Return array of fetched persons
  } catch (error) {
    console.error("Error fetching data from GraphQL API:", error);
    throw error; // Re-throw the error for handling by the caller
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Extract the 'expaIds' array from the request body
    const { expaIds } = await req.json();

    // Fetch data using expaIds (assuming you have a fetchDataFromGraphQL function)
    const data = await fetchDataFromGraphQL(expaIds);

    // Validate the structure of the incoming data array
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    // Connect to MongoDB
    await dbConnect();

    // Prepare an array of mapped member documents
    const memberDocuments: iMember[] = [];

    // Process each member data and map to Mongoose schema
    for (const memberData of data) {
      const { id, full_name, gender, created_at, home_lc, member_positions } =
        memberData;

      if (
        typeof id !== "string" ||
        typeof full_name !== "string" ||
        typeof gender !== "string" ||
        typeof created_at !== "string" ||
        !home_lc ||
        typeof home_lc.name !== "string" ||
        !Array.isArray(member_positions) ||
        member_positions.length === 0
      ) {
        console.warn(
          "Skipping member data due to missing or invalid fields:",
          memberData
        );
        continue; // Skip current member if data is invalid
      }

      const mappedMemberData: iMember = {
        id: parseInt(id),
        full_name,
        gender,
        created_at: new Date(created_at),
        role: "Member", // Default role value (adjust as needed)
        home_lc: { name: home_lc.name },
        member_positions: member_positions.map((position) => ({
          function: { name: position.function?.name || "Unknown Function" },
          start_date: new Date(position.start_date),
          end_date: new Date(position.end_date),
          office: { name: position.office?.name || "Unknown Office" },
          role: { name: position.role?.name || "Unknown Role" },
          committee_department: {
            name: position.committee_department?.name || "Unknown Department"
          }
        }))
      };

      memberDocuments.push(mappedMemberData);
    }

    // Insert new members if they do not already exist in the database
    await insertMembersIfNotExist(memberDocuments);

    return Response.json(
      { message: "Members inserted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving member:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();

    // Check if a specific user ID is provided in the query parameters
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId") as string | undefined;

    if (userId) {
      // Fetch a specific user by ID if userId is provided
      const user = await Member.findOne({ id: userId });
      if (!user) {
        return Response.json({ message: "User not found" }, { status: 200 });
      }

      return Response.json({ user: user });
    } else {
      // Fetch all users if no userId is provided
      const users = await Member.find({});

      if (!users || users.length === 0) {
        return Response.json({ message: "No users found" });
      }

      return Response.json({ users });
    }

    //const members = await Member.find({});
    //return Response.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return Response.json({ hello: "Data na" }, { status: 500 });
  }
}
