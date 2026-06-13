export type Domain = {
  host: string;
  port: number;
  https: boolean;
  createdAt: string;
};

export type Registry = {
  domains: Domain[];
};
