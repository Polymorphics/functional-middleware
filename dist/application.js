"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationCaller = exports.createApplication = void 0;
const middleware_stack_1 = require("./middleware-stack");
const createApplication = (application) => {
    var _a, _b;
    const stack = (_a = application === null || application === void 0 ? void 0 : application.stack) !== null && _a !== void 0 ? _a : (0, middleware_stack_1.createMiddlewareStack)();
    const caller = (_b = application === null || application === void 0 ? void 0 : application.caller) !== null && _b !== void 0 ? _b : (0, exports.createApplicationCaller)();
    return Object.assign({
        stack,
        caller,
        use: (middleware) => stack.add(middleware),
        ready: () => caller(stack.initializer().reverse()),
        process: () => caller(stack.handler().reverse()),
        close: () => caller(stack.finalizer().reverse()),
    }, application);
};
exports.createApplication = createApplication;
const createApplicationCaller = (caller = (chain) => {
    const next = () => {
        const func = chain.pop();
        func && func(next);
    };
    next();
}) => caller;
exports.createApplicationCaller = createApplicationCaller;
//# sourceMappingURL=application.js.map