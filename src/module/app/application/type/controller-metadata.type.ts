export type ClassMethod = (...args: unknown[]) => unknown;

export type Constructor<T = unknown> = new (...args: unknown[]) => T;

export type ControllerMetadata = {
  metatype: Constructor;
  instance: ControllerInstance;
};
export type Endpoints = {
  [entity: string]: Endpoint;
};
export type ControllerInstance = {
  [key: string]: unknown;
};
export type Endpoint = {
  basePath?: string;
  methods: Set<string>;
};

export type EndpointMetadata =
  | {
      entity: string;
    }
  | undefined;
