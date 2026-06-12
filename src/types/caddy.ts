export type CaInfo = {
  id: string;
  name: string;
  root_common_name?: string;
  root_certificate?: string;
};

export type Route = {
  '@id'?: string;
  match?: Array<{ host?: string[] }>;
  handle?: Array<{ handler: string; upstreams?: Array<{ dial: string }> }>;
  terminal?: boolean;
};

export type AnyConfig = Record<string, any>;
