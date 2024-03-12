export const COLLECTIONS = {
  USERS: "users",
  RESOURCES: "resources"
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
  RESOURCE_DELETED: "Resource deleted successfully"
};

export const ERROR_MESSAGES = {
  // Resources
  RESOURCES_FETCH_FAILED: "Failed to fetch resources",
  RESOURCE_FETCH_FAILED: "Failed to fetch resource",
  RESOURCE_CREATE_FAILED: "Failed to create resource",
  RESOURCE_UPDATE_FAILED: "Failed to update resource",
  RESOURCE_DELETE_FAILED: "Failed to delete resource",
  RESOURCE_NOT_FOUND: "Resource not found",
  RESOURCE_ID_INVALID: "Invalid resource ID"
};
