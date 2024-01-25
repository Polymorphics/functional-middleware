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
    caller?: ((chain: ApplicationCallerChain) => void) | undefined;
} | undefined) => Application<Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>, any, any, any>;
export declare const createApplicationCaller: (caller?: (chain: ApplicationCallerChain) => void) => (chain: ApplicationCallerChain) => void;
export interface Application<M extends Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>, ReadyOption, ProcessOption, CloseOption> {
    stack: MiddlewareStack<M>;
    use: (middleware: M) => number;
    ready: (option?: () => ReadyOption) => void;
    process: (option?: () => ProcessOption) => void;
    close: (option?: () => CloseOption) => void;
    caller: (chain: ApplicationCallerChain) => void;
}
export interface ApplicationCallerChain extends Array<MiddlewareInitializer<any> | MiddlewareHandler<any, any> | MiddlewareFinalizer<any>> {
}
