import { Middleware, MiddlewareFinalizer, MiddlewareHandler, MiddlewareInitializer } from "./middleware";
export declare const createMiddlewareStack: (stack?: {
    [name: string]: MiddlewareEntry<Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>>;
}) => MiddlewareStack<Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>>;
export interface MiddlewareStack<M extends Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>> {
    add: (middleware: M, entry?: string) => number;
    middleware: (entry?: string) => Array<M>;
    initializer: (entry?: string) => Array<MiddlewareInitializer<any>>;
    handler: (entry?: string) => Array<MiddlewareHandler<any, any>>;
    finalizer: (entry?: string) => Array<MiddlewareFinalizer<any>>;
}
export interface MiddlewareEntry<M extends Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>> extends Array<M> {
}
