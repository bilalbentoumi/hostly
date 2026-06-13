export type DomainScheme = 'http' | 'https' | 'both';

export type Domain = {
  host: string;
  port: number;
  scheme: DomainScheme;
  createdAt: string;
};

export type Registry = {
  domains: Domain[];
};
