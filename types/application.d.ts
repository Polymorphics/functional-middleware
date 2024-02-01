/// <reference types="node" />
/// <reference types="node" />
import { Middleware, MiddlewareFinalizer, MiddlewareHandler, MiddlewareInitializer } from "./middleware";
import { MiddlewareStack } from "./middleware-stack";
export declare const createApplication: (application?: {
    stack?: MiddlewareStack<Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>> | undefined;
    use?: ((middleware: Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>) => void) | undefined;
    ready?: ((option?: () => any) => void) | undefined;
    process?: ((option?: () => any) => void) | undefined;
    close?: ((option?: () => any) => void) | undefined;
    initialize?: ((chain: ApplicationCallerChain<MiddlewareInitializer<any>>) => void) | undefined;
    handle?: ((chain: ApplicationCallerChain<MiddlewareHandler<any, any>>) => void) | undefined;
    finalize?: ((chain: ApplicationCallerChain<MiddlewareFinalizer<any>>) => void) | undefined;
} | undefined) => Application<Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>, any, any, any>;
export declare const createApplicationCaller: (caller?: (chain: ApplicationCallerChain<any>) => void) => (chain: ApplicationCallerChain<any>) => void;
export interface Application<M extends Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>, ReadyOption, ProcessOption, CloseOption> {
    stack: MiddlewareStack<M>;
    use: (middleware: M) => number;
    ready: (option?: () => ReadyOption) => void;
    process: (option?: () => ProcessOption) => void;
    close: (option?: () => CloseOption) => void;
    initialize: (chain: ApplicationCallerChain<MiddlewareInitializer<any>>) => void;
    handle: (chain: ApplicationCallerChain<MiddlewareHandler<any, any>>) => void;
    finalize: (chain: ApplicationCallerChain<MiddlewareFinalizer<any>>) => void;
}
export interface ApplicationCallerChain<T> extends Array<T> {
}
