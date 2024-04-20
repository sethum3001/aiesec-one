import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ResourceRequest } from "@/types/ResourceRequest";
import { ResourceResponse } from "@/types/ResourceResponse";
import {
  API_ENDPOINTS,
  QUERY_KEYS,
  SHORT_LINK_PREFIXES
} from "@/lib/constants";

function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resource: ResourceRequest) => {
      console.log(resource);
      resource.shortLink = SHORT_LINK_PREFIXES.RESOURCES + resource.shortLink;
      const response = await fetch(API_ENDPOINTS.RESOURCES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(resource)
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCES] })
  });
}

function useGetResources() {
  return useQuery<ResourceResponse[]>({
    queryKey: [QUERY_KEYS.RESOURCES],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.RESOURCES);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()).data;
    },
    refetchOnWindowFocus: false
  });
}

function useUpdateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resource: ResourceRequest) => {
      resource.shortLink = SHORT_LINK_PREFIXES.RESOURCES + resource.shortLink;
      const response = await fetch(
        `${API_ENDPOINTS.RESOURCES}/${resource._id}`,
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
            ? newResourceInfo
            : prevResource
        )
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCES] })
  });
}

function useDeleteResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_ENDPOINTS.RESOURCES}/${id}`, {
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
          (resourceResponse: ResourceResponse) => resourceResponse._id !== id
        )
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCES] })
  });
}

export {
  useCreateResource,
  useGetResources,
  useUpdateResource,
  useDeleteResource
};
