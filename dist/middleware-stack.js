"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMiddlewareStack = void 0;
const createMiddlewareStack = (stack = {
    default: Array(),
}) => Object.create({
    add: (middleware, entry = "default") => { var _a; return (_a = stack[entry]) === null || _a === void 0 ? void 0 : _a.push(middleware); },
    remove: (middleware, entry = "default") => {
        var _a, _b;
        const origin = ((_a = stack[entry]) === null || _a === void 0 ? void 0 : _a.length) || 0;
        if (origin) {
            stack[entry] = stack[entry].filter((something) => !Object.is(something, middleware));
        }
        return origin - (((_b = stack[entry]) === null || _b === void 0 ? void 0 : _b.length) || 0);
    },
    clear: (entry = "default") => {
        var _a;
        const origin = ((_a = stack[entry]) === null || _a === void 0 ? void 0 : _a.length) || 0;
        if (origin) {
            stack[entry] = stack[entry].slice(stack[entry].length);
        }
        return origin;
    },
    middleware: (entry = "default") => { var _a; return ((_a = stack[entry]) === null || _a === void 0 ? void 0 : _a.map((middleware) => middleware)) || []; },
    initializer: (entry = "default") => { var _a; return ((_a = stack[entry]) === null || _a === void 0 ? void 0 : _a.map((middleware) => middleware.initializer)) || []; },
    handler: (entry = "default") => { var _a; return ((_a = stack[entry]) === null || _a === void 0 ? void 0 : _a.map((middleware) => middleware.handler)) || []; },
    finalizer: (entry = "default") => { var _a; return ((_a = stack[entry]) === null || _a === void 0 ? void 0 : _a.map((middleware) => middleware.finalizer)) || []; },
});
exports.createMiddlewareStack = createMiddlewareStack;
//# sourceMappingURL=middleware-stack.js.map