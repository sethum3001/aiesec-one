import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OpportunityRequest } from "@/app/types/OpportunityRequest";
import { OpportunityResponse } from "@/app/types/OpportunityResponse";

function useCreateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (opportunity: OpportunityRequest) => {
      const { img, title, url, description, link, shortLink } = opportunity;
      console.log(img);

      const handleUpload = async (): Promise<
        { filename: string; uniqueFilename: string } | undefined
      > => {
        if (!img) return;

        const [filename, extension] = img.name.split(".");

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: JSON.stringify({ extension })
          });
          const { url, uniqueFilename } = await response.json();

          await fetch(url, {
            method: "PUT",
            body: img
          });

          return uniqueFilename;
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      };

      const uniqueFilename = await handleUpload();

      const opportunityData = {
        title: title,
        url: url,
        description: description,
        link: link,
        shortLink: "http://localhost:3000/opportunities/" + url,
        covImg: img.name,
        covImgUnique: uniqueFilename
      };

      console.log(opportunityData, "opportunityData");

      //creating new opportunity
      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg,image/jpg,image/png"
        },
        body: JSON.stringify(opportunityData)
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
      const response = await fetch("/api/opportunities", {
        method: "GET"
      });
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
      const { img, title, url, description, link, shortLink } = opportunity;
      console.log(img);

      const handleUpload = async (): Promise<
        { filename: string; uniqueFilename: string } | undefined
      > => {
        if (!img) return;

        const [filename, extension] = img.name.split(".");

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: JSON.stringify({ extension })
          });
          const { url, uniqueFilename } = await response.json();

          await fetch(url, {
            method: "PUT",
            body: img
          });

          return uniqueFilename;
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      };

      const uniqueFilename = await handleUpload();

      const opportunityData = {
        title: title,
        url: url,
        description: description,
        link: link,
        shortLink: "http://localhost:3000/opportunities/" + url,
        covImg: img.name,
        covImgUnique: uniqueFilename
      };

      console.log(opportunityData, "opportunityData");
      console.log(`${process.env.NEXTAUTH_URL}`);

      const response = await fetch(`/api/opportunities/${opportunity._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "image/jpeg,image/jpg,image/png"
        },
        body: JSON.stringify(opportunityData)
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
