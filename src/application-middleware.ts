/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Middleware,
  MiddlewareFinalizer,
  MiddlewareHandler,
  MiddlewareInitializer,
} from "./middleware";
import { Application, createApplication } from "./application";

export const createApplicationMiddleware = (
  application: Application<
    Middleware<
      MiddlewareInitializer<any>,
      MiddlewareHandler<any, any>,
      MiddlewareFinalizer<any>
    >,
    any,
    any,
    any
  > = createApplication(),
): ApplicationMiddleware<
  MiddlewareInitializer<any>,
  MiddlewareHandler<any, any>,
  MiddlewareFinalizer<any>,
  Middleware<
    MiddlewareInitializer<any>,
    MiddlewareHandler<any, any>,
    MiddlewareFinalizer<any>
  >,
  any,
  any,
  any
> =>
  Object.assign(
    {
      initializer: (next: () => void) => {
        application.ready();
        next();
      },
      handler: (next: () => void) => {
        application.process();
        next();
      },
      finalizer: (next: () => void) => {
        application.close();
        next();
      },
    },
    application,
  );

export interface ApplicationMiddleware<
  I extends MiddlewareInitializer<any>,
  H extends MiddlewareHandler<any, any>,
  F extends MiddlewareFinalizer<any>,
  M extends Middleware<
    MiddlewareInitializer<any>,
    MiddlewareHandler<any, any>,
    MiddlewareFinalizer<any>
  >,
  ReadyOption,
  ProcessOption,
  CloseOption,
> extends Middleware<I, H, F>,
    Application<M, ReadyOption, ProcessOption, CloseOption> {}
