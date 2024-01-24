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
  caller?: (chain: ApplicationCallerChain) => void;
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
  const caller = application?.caller ?? createApplicationCaller();

  return Object.assign(
    {
      stack,
      caller,
      use: (
        middleware: Middleware<
          MiddlewareInitializer<any>,
          MiddlewareHandler<any, any>,
          MiddlewareFinalizer<any>
        >,
      ) => stack.add(middleware),
      ready: () => caller(stack.initializer().reverse()),
      process: () => caller(stack.handler().reverse()),
      close: () => caller(stack.finalizer().reverse()),
    },
    application,
  );
};

export const createApplicationCaller = (
  caller: (chain: ApplicationCallerChain) => void = (chain) => {
    const next = () => {
      const func = chain.pop();
      func && func(next);
    };
    next();
  },
): ((chain: ApplicationCallerChain) => void) => caller;

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
  caller: (chain: ApplicationCallerChain) => void;
}

export interface ApplicationCallerChain
  extends Array<
    | MiddlewareInitializer<any>
    | MiddlewareHandler<any, any>
    | MiddlewareFinalizer<any>
  > {}
