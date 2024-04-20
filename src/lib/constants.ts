export const COLLECTIONS = {
  USERS: "users",
  RESOURCES: "resources",
  OPPORTUNITIES: "opportunities"
};

export const API_ENDPOINTS = {
  RESOURCES: "/api/resources",
  OPPORTUNITIES: "/api/opportunities"
};

export const QUERY_KEYS = {
  RESOURCES: "resources",
  OPPORTUNITIES: "opportunities"
};

export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

export const SUCCESS_MESSAGES = {
  // Resources
  RESOURCES_FETCHED: "Resources fetched successfully",
  RESOURCE_FETCHED: "Resource fetched successfully",
  RESOURCE_CREATED: "Resource created successfully",
  RESOURCE_UPDATED: "Resource updated successfully",
  RESOURCE_DELETED: "Resource deleted successfully",

  // Opportunities
  OPPORTUNITY_CREATED: "Opportunity created successfully",
  OPPORTUNITY_FETCHED: "Opportunity fetched successfully",
  OPPORTUNITIES_FETCHED: "Opportunities fetched successfully",
  OPPORTUNITY_UPDATED: "Opportunity updated successfully",
  OPPORTUNITY_DELETED: "Opportunity deleted successfully",
  IMAGE_UPLOADED: "Image uploaded successfully"
};

export const ERROR_MESSAGES = {
  // Resources
  RESOURCES_FETCH_FAILED: "Failed to fetch resources",
  RESOURCE_FETCH_FAILED: "Failed to fetch resource",
  RESOURCE_CREATE_FAILED: "Failed to create resource",
  RESOURCE_UPDATE_FAILED: "Failed to update resource",
  RESOURCE_DELETE_FAILED: "Failed to delete resource",
  RESOURCE_NOT_FOUND: "Resource not found",
  RESOURCE_ID_INVALID: "Invalid resource ID",

  // Opportunities
  OPPORTUNITY_ID_INVALID: "Invalid opportunity ID",
  OPPORTUNITIES_FETCH_FAILED: "Failed to fetch opportunities",
  OPPORTUNITY_FETCH_FAILED: "Failed to fetch opportunity",
  OPPORTUNITY_NOT_FOUND: "Opportunity not found",
  OPPORTUNITY_CREATE_FAILED: "Failed to create opportunity",
  OPPORTUNITY_UPDATE_FAILED: "Failed to update opportunity",
  OPPORTUNITY_DELETE_FAILED: "Failed to delete opportunity",
  IMAGE_UPLOAD_FAILED: "Failed to upload image",
  IMAGE_NOT_FOUND: "Image not found",
  IMAGE_RETRIEVE_FAILED: "Failed to retrieve image"
};

export const APP_DOMAIN = "https://one.aiesec.lk/";

export const SHORT_URL_PREFIXES = {
  RESOURCES: APP_DOMAIN + "r/",
  OPPORTUNITIES: APP_DOMAIN + "opp/"
};

export const ENTITY_FUNCTIONS = [
  { label: "iGV", value: "iGV" },
  { label: "oGV", value: "oGV" },
  { label: "iGTa", value: "iGTa" },
  { label: "iGTe", value: "iGTe" },
  { label: "oGTa", value: "oGTa" },
  { label: "oGTe", value: "oGTe" },
  { label: "BD", value: "BD" },
  { label: "PM", value: "PM" },
  { label: "Brand", value: "Brand" },
  { label: "EwA", value: "EwA" },
  { label: "OD", value: "OD" },
  { label: "Finance", value: "Finance" },
  { label: "Legal", value: "Legal" },
  { label: "DXP", value: "DXP" },
  { label: "IM", value: "IM" },
  { label: "ED", value: "ED" },
  { label: "Misc", value: "Misc" }
];
