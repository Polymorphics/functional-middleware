# Functional-middleware #

The package of interfaces for implementation of a structure of middleware-tree.

## Concept ##

The functional-middleware is having these concepts:

* functional oriented - function parameters (`input`, `output`, `error`) are handlers like a callback function.
* middleware tree -  application design of middleware tree structure.

### Middleware tree ###

The middleware tree is tree structure of applications and pluggable middlewares.

#### Example of middleware tree ####
![](./doc/example%20of%20middleware%20tree.svg "Example of middleware tree")

### Interfaces ###

The package has four interfaces which are used by creation function:

#### Middleware ####

Middleware is bundles of three steps functions which are `initializer`, (main)`handler`, `finalizer`.

#### Middleware-stack ####

Middleware-stack includes stack for adding middleware and have accessor methods for extracting `middleware` and `handler`.

#### Application ####

Application is implementing `middleware-stack` and processing to call the `initializer`, `handler`, `finalizer` of `middleware`.

#### Application-middleware ####

Application-middleware has both behavior as `application` and addable `middleware`.

## Usage ##

### Installation ###

Install the npm package:

```shell
npm install functional-middleware --save
```

### Create function ###

Get middleware and application by creation functions:

#### Create middleware ####

The `createMiddleware` function creates a new middleware and is able to overwrite `initializer`, `handler`, `finalizer` as needed.

```js
/* javascript */
const middlewareSample = createMiddleware({
    initializer: (next, option) => {
        // overwrite initializer

        if (!option) {
            // callback next with error handler

            return next(() => Error("Missing option."));
        }

        // process something
        console.log("The middlewareSample was initialized.");

        // callback next
        next();
    },
    handler: (next, context) => {
        if (!context?.input) {
            // callback next with error handler

            return next(() => Error("Missing input."));
        }

        // get input
        const input = context.input();

        // process something
        console.log(input);

        // set output handler
        context?.output && context.output(() => "This is middlewareSample.");

        // callback next
        next();
    },
    finalizer: (next, option) => {
        // overwrite finalizer

        if (!option) {
            // callback next with error handler

            return next(() => Error("Missing option."));
        }

        // process something
        console.log("The middlewareSample was finalized.");

        // callback next
        next();
    },
});
```

```typescript
/* typescript */
const middlewareSample = createMiddleware({
    initializer: (next: (error?: () => Error) => void, option?: () => any) => {
        // overwrite initializer

        if (!option) {
            // callback next with error handler

            return next(() => Error("Missing option."));
        }

        // process something
        console.log("The middlewareSample was initialized.");

        // callback next
        next();
    },
    handler: (next: (error?: () => Error) => void, context) => {
        // overwrite handler

        if (!context?.input) {
            // callback next with error handler

            return next(() => Error("Missing input."));
        }

        // get input
        const input = context.input();

        // process something
        console.log(input);

        // set output handler
        context?.output && context.output(() => "This is middlewareSample.");

        // callback next
        next();
    },
    finalizer: (next: (error?: () => Error) => void, option?: () => any) => {
        // overwrite finalizer

        if (!option) {
            // callback next with error handler

            return next(() => Error("Missing option."));
        }

        // process something
        console.log("The middlewareSample was finalized.");

        // callback next
        next();
    },
});
```

#### Create application ####

The `createApplication` function creates a new top-level application.
It's able to overwrite as needed caller functions of `initialize`, `handle`, `finalize` and process functions of `ready`, `process`, `close`.

```js
/* javascript */
// create top-level application with overwriting handle
const topLevelApplication = createApplication({
    initialize: createApplicationCaller((chain) => {
        // set option
        const option = () => "initialize option";

        // overwrite next callback
        const next = (error) => {
            if (error) {
                // error handling

                return console.log("Error:", error().message);
            }

            const func = chain.pop();
            func && func(next, option);
        };

        next();
    }),
    handle: createApplicationCaller((chain) => {
        // set input
        const input = () => "Hello.";

        // get output from handler
        const output = (handler) => console.log(handler());

        // overwrite next callback
        const next = (error) => {
            if (error) {
                // error handling

                return console.log("Error:", error().message);
            }

            const func = chain.pop();
            func && func(next, { input, output });
        };

        next();
    }),
    finalize: createApplicationCaller((chain) => {
        // set option
        const option = () => "finalize option";

        // overwrite next callback
        const next = (error) => {
            if (error) {
                // error handling

                return console.log("Error:", error().message);
            }

            const func = chain.pop();
            func && func(next, option);
        };

        next();
    })
});

// set middlewares to stack in application
topLevelApplication.use(middlewareSampleA);
topLevelApplication.use(middlewareSampleB);

// call ready (process)
topLevelApplication.ready();

// call (main) process
topLevelApplication.process();

// call close (process)
topLevelApplication.close();
```

```typescript
/* typescript */
// create top-level application with overwriting handle
const topLevelApplication = createApplication({
    initialize: createApplicationCaller((chain) => {
        // set option
        const option = () => "initialize option";

        // overwrite next callback
        const next = (error?: () => Error) => {
            if (error) {
                // error handling

                return console.log("Error:", error().message);
            }

            const func = chain.pop();
            func && func(next, option);
        };

        next();
    }),
    handle: createApplicationCaller((chain) => {
        // set input
        const input = () => "Hello.";

        // get output from handler
        const output = (handler: ContextOutputHandler<string>) => console.log(handler());

        // overwrite next callback
        const next = (error?: () => Error) => {
            if (error) {
                // error handling

                return console.log("Error:", error().message);
            }

            const func = chain.pop();
            func && func(next, { input, output });
        };

        next();
    }),
    finalize: createApplicationCaller((chain) => {
        // set option
        const option = () => "finalize option";

        // overwrite next callback
        const next = (error?: () => Error) => {
            if (error) {
                // error handling

                return console.log("Error:", error().message);
            }

            const func = chain.pop();
            func && func(next, option);
        };

        next();
    })
});

// set middlewares to stack in application
topLevelApplication.use(middlewareSampleA);
topLevelApplication.use(middlewareSampleB);

// call ready (process)
topLevelApplication.ready();

// call (main) process
topLevelApplication.process();

// call close (process)
topLevelApplication.close();
```

#### Create application-middleware ####

If you need middleware-tree, the `createApplicationMiddleware` function is able to provide `application-middleware` as a middle-level application which has both behavior as application and addable middleware.

```js
/* javascript */
// create application-middleware using createApplication
const applicationMiddleware = createApplicationMiddleware(
    createApplication({
        initialize: createApplicationCaller((chain) => {
            // set option
            const option = () => "initialize option";

            // overwrite next callback
            const next = (error) => {
                if (error) {
                    // error handling

                    return console.log("Error:", error().message);
                }

                const func = chain.pop();
                func && func(next, option);
            };

            next();
        }),
        handle: createApplicationCaller((chain) => {
            // set input
            const input = () => "This is applicationMiddleware.";

            // get output from handler
            const output = (handler) => console.log(handler());

            // overwrite next callback
            const next = (error) => {
                if (error) {
                    // error handling

                    return console.log("Error:", error().message);
                }

                const func = chain.pop();
                func && func(next, { input, output });
            };

            next();
        }),
        finalize: createApplicationCaller((chain) => {
            // set option
            const option = () => "finalize option";

            // overwrite next callback
            const next = (error) => {
                if (error) {
                    // error handling

                    return console.log("Error:", error().message);
                }

                const func = chain.pop();
                func && func(next, option);
            };

            next();
        })
    })
);

// set middlewares to stack in application-middleware
applicationMiddleware.use(middlewareSampleA);
applicationMiddleware.use(middlewareSampleB);

// set application-middleware to stack in application
topLevelApplication.use(applicationMiddleware);

// call ready (process)
topLevelApplication.ready();

// call (main) process
topLevelApplication.process();

// call close (process)
topLevelApplication.close();
```

```typescript
/* typescript */
// create application-middleware using createApplication
const applicationMiddleware = createApplicationMiddleware(
    createApplication({
        initialize: createApplicationCaller((chain) => {
            // set option
            const option = () => "initialize option";

            // overwrite next callback
            const next = (error?: () => Error) => {
                if (error) {
                    // error handling

                    return console.log("Error:", error().message);
                }

                const func = chain.pop();
                func && func(next, option);
            };

            next();
        }),
        handle: createApplicationCaller((chain) => {
            // set input
            const input = () => "This is applicationMiddleware.";

            // get output from handler
            const output = (handler: ContextOutputHandler<string>) => console.log(handler());

            // overwrite next callback
            const next = (error?: () => Error) => {
                if (error) {
                    // error handling

                    return console.log("Error:", error().message);
                }

                const func = chain.pop();
                func && func(next, { input, output });
            };

            next();
        }),
        finalize: createApplicationCaller((chain) => {
            // set option
            const option = () => "finalize option";

            // overwrite next callback
            const next = (error?: () => Error) => {
                if (error) {
                    // error handling

                    return console.log("Error:", error().message);
                }

                const func = chain.pop();
                func && func(next, option);
            };

            next();
        })
    })
);

// set middlewares to stack in application-middleware
applicationMiddleware.use(middlewareSampleA);
applicationMiddleware.use(middlewareSampleB);

// set application-middleware to stack in application
topLevelApplication.use(applicationMiddleware);

// call ready (process)
topLevelApplication.ready();

// call (main) process
topLevelApplication.process();

// call close (process)
topLevelApplication.close();
```

#### Create middleware-stack ####

If you need another from the default stack,  the `createMiddlewareStack` function is able to provide `middleware-stack` with an overwritten stack.

```js
/* javascript */
// two priority stack
const multipleMiddlewareStack = createMiddlewareStack({
    primary: Array(),
    secondary: Array(),
});

// overwrite accessors
Object.assign(multipleMiddlewareStack, {
    add: (middleware) => Object.getPrototypeOf(multipleMiddlewareStack).add(middleware, "primary"),
    remove: (middleware) => Object.getPrototypeOf(multipleMiddlewareStack).remove(middleware, "primary"),
    clear: () => Object.getPrototypeOf(multipleMiddlewareStack).clear("primary"),
    middleware: () => Object.getPrototypeOf(multipleMiddlewareStack).middleware("primary"),
    initializer: () => Object.getPrototypeOf(multipleMiddlewareStack).initializer("primary"),
    handler: () => Object.getPrototypeOf(multipleMiddlewareStack).handler("primary"),
    finalizer: () => Object.getPrototypeOf(multipleMiddlewareStack).finalizer("primary"),
});

// create application with multiple stack
const multipleStackApplication = createApplication({ stack: multipleMiddlewareStack });
```

```typescript
/* typescript */
// two priority stack
const multipleMiddlewareStack = createMiddlewareStack({
    primary:
        Array<
            Middleware<
                MiddlewareInitializer<any>,
                MiddlewareHandler<any, any>,
                MiddlewareFinalizer<any>
            >
        >(),
    secondary:
        Array<
            Middleware<
                MiddlewareInitializer<any>,
                MiddlewareHandler<any, any>,
                MiddlewareFinalizer<any>
            >
        >(),
});

// overwrite accessors
Object.assign(multipleMiddlewareStack, {
    add: (
        middleware: Middleware<
            MiddlewareInitializer<any>,
            MiddlewareHandler<any, any>,
            MiddlewareFinalizer<any>
        >
    ) => Object.getPrototypeOf(multipleMiddlewareStack).add(middleware, "primary"),
    remove: (
        middleware: Middleware<
            MiddlewareInitializer<any>,
            MiddlewareHandler<any, any>,
            MiddlewareFinalizer<any>
        >
    ) => Object.getPrototypeOf(multipleMiddlewareStack).remove(middleware, "primary"),
    clear: () => Object.getPrototypeOf(multipleMiddlewareStack).clear("primary"),
    middleware: () => Object.getPrototypeOf(multipleMiddlewareStack).middleware("primary"),
    initializer: () => Object.getPrototypeOf(multipleMiddlewareStack).initializer("primary"),
    handler: () => Object.getPrototypeOf(multipleMiddlewareStack).handler("primary"),
    finalizer: () => Object.getPrototypeOf(multipleMiddlewareStack).finalizer("primary"),
});

// create application with multiple stack
const multipleStackApplication = createApplication({ stack: multipleMiddlewareStack });
```

## License ##

[MIT](LICENSE)
