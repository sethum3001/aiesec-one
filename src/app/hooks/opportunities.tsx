import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OpportunityRequest } from "@/app/types/OpportunityRequest";
import { OpportunityResponse } from "@/app/types/OpportunityResponse";

function useCreateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (opportunity: OpportunityRequest) => {
      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(opportunity)
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["opportunities"] })
  });
}

function useGetOpportunities() {
  return useQuery<OpportunityResponse[]>({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const response = await fetch("/api/opportunities");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()).data;
    },
    refetchOnWindowFocus: false
  });
}

function useUpdateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (opportunity: OpportunityResponse) => {
      const response = await fetch(`/api/opportunities/${opportunity._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(opportunity)
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onMutate: (newOpportunityInfo: OpportunityResponse) => {
      queryClient.setQueryData(["opportunities"], (prevOpportunities: any) =>
        prevOpportunities?.map((prevOpportunity: OpportunityResponse) =>
          prevOpportunity._id === newOpportunityInfo._id
            ? newOpportunityInfo
            : prevOpportunity
        )
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["opportunities"] })
  });
}

function useDeleteOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/opportunities/${id}`, {
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
      queryClient.setQueryData(["opportunities"], (prevOpportunities: any) =>
        prevOpportunities?.filter(
          (opportunityResponse: OpportunityResponse) =>
            opportunityResponse._id !== id
        )
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["opportunities"] })
  });
}

export {
  useCreateOpportunity,
  useGetOpportunities,
  useUpdateOpportunity,
  useDeleteOpportunity
};
