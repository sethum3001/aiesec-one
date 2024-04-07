import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ResourceRequest } from "@/app/types/ResourceRequest";
import { ResourceResponse } from "@/app/types/ResourceResponse";

function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resource: ResourceRequest) => {
      const response = await fetch("/api/resources", {
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["resources"] })
  });
}

function useGetResources() {
  return useQuery<ResourceResponse[]>({
    queryKey: ["resources"],
    queryFn: async () => {
      const response = await fetch("/api/resources");
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
    mutationFn: async (resource: ResourceResponse) => {
      const response = await fetch(`/api/resources/${resource._id}`, {
        method: "PUT",
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
    onMutate: (newResourceInfo: ResourceResponse) => {
      queryClient.setQueryData(["resources"], (prevResources: any) =>
        prevResources?.map((prevResource: ResourceResponse) =>
          prevResource._id === newResourceInfo._id
            ? newResourceInfo
            : prevResource
        )
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["resources"] })
  });
}

function useDeleteResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/resources/${id}`, {
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
      queryClient.setQueryData(["resources"], (prevResources: any) =>
        prevResources?.filter(
          (resourceResponse: ResourceResponse) => resourceResponse._id !== id
        )
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["resources"] })
  });
}

export {
  useCreateResource,
  useGetResources,
  useUpdateResource,
  useDeleteResource
};
