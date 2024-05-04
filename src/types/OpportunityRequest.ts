export type OpportunityRequest = {
  _id?: string;
  title: string;
  description: string;
  originalUrl: string;
  shortLink: string;
  coverImage?: File | null;
  deadline: string;
};
