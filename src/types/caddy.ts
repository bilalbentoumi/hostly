export type CaInfo = {
  id: string;
  name: string;
  root_common_name?: string;
  root_certificate?: string;
};

export type CertStatus = {
  reachable: boolean;
  ca?: CaInfo;
};

export type Route = {
  '@id'?: string;
  match?: Array<{ host?: string[]; protocol?: string }>;
  handle?: Array<{
    handler: string;
    upstreams?: Array<{ dial: string }>;
    status_code?: number;
    headers?: Record<string, string[]>;
  }>;
  terminal?: boolean;
};

export type AnyConfig = Record<string, any>;
