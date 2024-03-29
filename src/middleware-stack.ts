/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Middleware,
  MiddlewareFinalizer,
  MiddlewareHandler,
  MiddlewareInitializer,
} from "./middleware";

export const createMiddlewareStack = (
  stack: {
    [name: string]: MiddlewareEntry<
      Middleware<
        MiddlewareInitializer<any>,
        MiddlewareHandler<any, any>,
        MiddlewareFinalizer<any>
      >
    >;
  } = {
    default:
      Array<
        Middleware<
          MiddlewareInitializer<any>,
          MiddlewareHandler<any, any>,
          MiddlewareFinalizer<any>
        >
      >(),
  },
): MiddlewareStack<
  Middleware<
    MiddlewareInitializer<any>,
    MiddlewareHandler<any, any>,
    MiddlewareFinalizer<any>
  >
> =>
  Object.create({
    add: (
      middleware: Middleware<
        MiddlewareInitializer<any>,
        MiddlewareHandler<any, any>,
        MiddlewareFinalizer<any>
      >,
      entry = "default",
    ) => stack[entry]?.push(middleware),
    remove: (
      middleware: Middleware<
        MiddlewareInitializer<any>,
        MiddlewareHandler<any, any>,
        MiddlewareFinalizer<any>
      >,
      entry = "default",
    ) => {
      const origin = stack[entry]?.length || 0;
      if (origin) {
        stack[entry] = stack[entry].filter(
          (something) => !Object.is(something, middleware),
        );
      }

      return origin - (stack[entry]?.length || 0);
    },
    clear: (entry = "default") => {
      const origin = stack[entry]?.length || 0;
      if (origin) {
        stack[entry] = stack[entry].slice(stack[entry].length);
      }

      return origin;
    },
    middleware: (entry = "default") =>
      stack[entry]?.map((middleware) => middleware) || [],
    initializer: (entry = "default") =>
      stack[entry]?.map((middleware) => middleware.initializer) || [],
    handler: (entry = "default") =>
      stack[entry]?.map((middleware) => middleware.handler) || [],
    finalizer: (entry = "default") =>
      stack[entry]?.map((middleware) => middleware.finalizer) || [],
  });

export interface MiddlewareStack<
  M extends Middleware<
    MiddlewareInitializer<any>,
    MiddlewareHandler<any, any>,
    MiddlewareFinalizer<any>
  >,
> {
  add: (middleware: M, entry?: string) => number;
  remove: (middleware: M, entry?: string) => number;
  clear: (entry?: string) => number;
  middleware: (entry?: string) => Array<M>;
  initializer: (entry?: string) => Array<MiddlewareInitializer<any>>;
  handler: (entry?: string) => Array<MiddlewareHandler<any, any>>;
  finalizer: (entry?: string) => Array<MiddlewareFinalizer<any>>;
}

export interface MiddlewareEntry<
  M extends Middleware<
    MiddlewareInitializer<any>,
    MiddlewareHandler<any, any>,
    MiddlewareFinalizer<any>
  >,
> extends Array<M> {}
