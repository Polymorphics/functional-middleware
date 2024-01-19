/* eslint-disable @typescript-eslint/no-explicit-any */
export const createMiddleware = (middleware?: {
  initializer?: MiddlewareInitializer<any>;
  handler: MiddlewareHandler<any, any>;
  finalizer?: MiddlewareFinalizer<any>;
}): Middleware<
  MiddlewareInitializer<any>,
  MiddlewareHandler<any, any>,
  MiddlewareFinalizer<any>
> =>
  Object.assign(
    {
      initializer: (next: () => void) => next(),
      handler: (next: () => void) => next(),
      finalizer: (next: () => void) => next(),
    },
    middleware,
  );

export interface Middleware<
  I extends MiddlewareInitializer<any>,
  H extends MiddlewareHandler<any, any>,
  F extends MiddlewareFinalizer<any>,
> {
  initializer: I;
  handler: H;
  finalizer: F;
}

export interface MiddlewareInitializer<Option> {
  (next: (error?: () => Error) => void, option?: () => Option): void;
}

export interface MiddlewareHandler<Input, Output> {
  (
    next: (error?: () => Error) => void,
    context?: MiddlewareHandlerContext<Input, Output>,
  ): void;
}

export interface MiddlewareHandlerContext<Input, Output> {
  input?: () => Input;
  output?: (handler: ContextOutputHandler<Output>) => void;
}

export interface ContextOutputHandler<Output> {
  (): Output;
}

export interface MiddlewareFinalizer<Option> {
  (next: (error?: () => Error) => void, option?: () => Option): void;
}
