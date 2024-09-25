import { GraphQLClient } from "graphql-request";

const endpoint = process.env.GRAPHQL_ENDPOINT; // Replace with your GraphQL API endpoint
const apiKey = process.env.GRAPHQL_API_KEY; // Replace 'YOUR_API_KEY' with your actual API key

const client = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `${apiKey}`
    // Add other headers if necessary
  }
});

export async function requestGraphQL(
  query: string,
  variables: Record<string, any>
) {
  try {
    const data = await client.request(query, variables);
    return data;
  } catch (error) {
    console.error("Error fetching data from GraphQL API:", error);
    throw error;
  }
}
