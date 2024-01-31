/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Middleware,
  MiddlewareFinalizer,
  MiddlewareHandler,
  MiddlewareInitializer,
} from "./middleware";
import { createMiddlewareStack, MiddlewareStack } from "./middleware-stack";

export const createApplication = (application?: {
  stack?: MiddlewareStack<
    Middleware<
      MiddlewareInitializer<any>,
      MiddlewareHandler<any, any>,
      MiddlewareFinalizer<any>
    >
  >;
  use?: (
    middleware: Middleware<
      MiddlewareInitializer<any>,
      MiddlewareHandler<any, any>,
      MiddlewareFinalizer<any>
    >,
  ) => void;
  ready?: (option?: () => any) => void;
  process?: (option?: () => any) => void;
  close?: (option?: () => any) => void;
  initialize?: (
    chain: ApplicationCallerChain<MiddlewareInitializer<any>>,
  ) => void;
  handle?: (chain: ApplicationCallerChain<MiddlewareHandler<any, any>>) => void;
  finalize?: (chain: ApplicationCallerChain<MiddlewareFinalizer<any>>) => void;
}): Application<
  Middleware<
    MiddlewareInitializer<any>,
    MiddlewareHandler<any, any>,
    MiddlewareFinalizer<any>
  >,
  any,
  any,
  any
> => {
  const stack = application?.stack ?? createMiddlewareStack();
  const initialize = application?.initialize ?? createApplicationCaller();
  const handle = application?.handle ?? createApplicationCaller();
  const finalize = application?.finalize ?? createApplicationCaller();

  return Object.assign(
    {
      stack,
      initialize,
      handle,
      finalize,
      use: (
        middleware: Middleware<
          MiddlewareInitializer<any>,
          MiddlewareHandler<any, any>,
          MiddlewareFinalizer<any>
        >,
      ) => stack.add(middleware),
      ready: () => initialize(stack.initializer().reverse()),
      process: () => handle(stack.handler().reverse()),
      close: () => finalize(stack.finalizer().reverse()),
    },
    application,
  );
};

export const createApplicationCaller = (
  caller: (chain: ApplicationCallerChain<any>) => void = (chain) => {
    const next = () => {
      const func = chain.pop();
      func && func(next);
    };
    next();
  },
): ((chain: ApplicationCallerChain<any>) => void) => caller;

export interface Application<
  M extends Middleware<
    MiddlewareInitializer<any>,
    MiddlewareHandler<any, any>,
    MiddlewareFinalizer<any>
  >,
  ReadyOption,
  ProcessOption,
  CloseOption,
> {
  stack: MiddlewareStack<M>;
  use: (middleware: M) => number;
  ready: (option?: () => ReadyOption) => void;
  process: (option?: () => ProcessOption) => void;
  close: (option?: () => CloseOption) => void;
  initialize: (
    chain: ApplicationCallerChain<MiddlewareInitializer<any>>,
  ) => void;
  handle: (chain: ApplicationCallerChain<MiddlewareHandler<any, any>>) => void;
  finalize: (chain: ApplicationCallerChain<MiddlewareFinalizer<any>>) => void;
}

export interface ApplicationCallerChain<T> extends Array<T> {}
