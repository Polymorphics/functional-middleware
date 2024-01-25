"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMiddleware = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const createMiddleware = (middleware) => Object.assign({
    initializer: (next) => next(),
    handler: (next) => next(),
    finalizer: (next) => next(),
}, middleware);
exports.createMiddleware = createMiddleware;
//# sourceMappingURL=middleware.js.map