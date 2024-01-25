import { Middleware, MiddlewareFinalizer, MiddlewareHandler, MiddlewareInitializer } from "./middleware";
import { Application } from "./application";
export declare const createApplicationMiddleware: (application?: Application<Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>, any, any, any>) => ApplicationMiddleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>, Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>, any, any, any>;
export interface ApplicationMiddleware<I extends MiddlewareInitializer<any>, H extends MiddlewareHandler<any, any>, F extends MiddlewareFinalizer<any>, M extends Middleware<MiddlewareInitializer<any>, MiddlewareHandler<any, any>, MiddlewareFinalizer<any>>, ReadyOption, ProcessOption, CloseOption> extends Middleware<I, H, F>, Application<M, ReadyOption, ProcessOption, CloseOption> {
}
