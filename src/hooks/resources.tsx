import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ResourceRequest } from "@/types/ResourceRequest";
import { ResourceResponse } from "@/types/ResourceResponse";
import {
  API_ENDPOINTS,
  QUERY_KEYS,
  SHORT_LINK_PREFIXES
} from "@/lib/constants"; // Import constants for API endpoints, query keys, and link prefixes

// Custom hook for creating a resource
function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resource: ResourceRequest) => {
      console.log(resource);
      resource.shortLink = SHORT_LINK_PREFIXES.RESOURCES + resource.shortLink; // Prepend the short link prefix
      const response = await fetch(API_ENDPOINTS.RESOURCES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(resource)
      });
      if (!response.ok) { // Check if response is OK
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCES] })
  });
}

// Custom hook for fetching resources
function useGetResources() {
  return useQuery<ResourceResponse[]>({
    queryKey: [QUERY_KEYS.RESOURCES], // Define query key for resource fetching
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.RESOURCES); // Fetch resources from API
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()).data;
    },
    refetchOnWindowFocus: false
  });
}

// Custom hook for updating a resource
function useUpdateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resource: ResourceRequest) => {
      resource.shortLink = SHORT_LINK_PREFIXES.RESOURCES + resource.shortLink; // Prepend the short link prefix
      const response = await fetch(
        `${API_ENDPOINTS.RESOURCES}/${resource._id}`, // Construct URL with resource ID
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(resource)
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onMutate: (newResourceInfo: ResourceRequest) => {
      queryClient.setQueryData([QUERY_KEYS.RESOURCES], (prevResources: any) =>
        prevResources?.map((prevResource: ResourceResponse) =>
          prevResource._id === newResourceInfo._id
            ? newResourceInfo // Update the resource in the cache
            : prevResource
        )
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCES] }) // Invalidate and refetch resource queries on mutation
  });
}

// Custom hook for deleting a resource
function useDeleteResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_ENDPOINTS.RESOURCES}/${id}`, { // Construct URL with resource ID
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onMutate: (id: string) => {
      queryClient.setQueryData([QUERY_KEYS.RESOURCES], (prevResources: any) =>
        prevResources?.filter(
          (resourceResponse: ResourceResponse) => resourceResponse._id !== id // Remove deleted resource from cache
        )
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCES] }) // Invalidate and refetch resource queries on mutation
  });
}

export {
  useCreateResource,
  useGetResources,
  useUpdateResource,
  useDeleteResource
};
