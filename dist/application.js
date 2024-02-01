"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationCaller = exports.createApplication = void 0;
const middleware_stack_1 = require("./middleware-stack");
const createApplication = (application) => {
    var _a, _b, _c, _d;
    const stack = (_a = application === null || application === void 0 ? void 0 : application.stack) !== null && _a !== void 0 ? _a : (0, middleware_stack_1.createMiddlewareStack)();
    const initialize = (_b = application === null || application === void 0 ? void 0 : application.initialize) !== null && _b !== void 0 ? _b : (0, exports.createApplicationCaller)();
    const handle = (_c = application === null || application === void 0 ? void 0 : application.handle) !== null && _c !== void 0 ? _c : (0, exports.createApplicationCaller)();
    const finalize = (_d = application === null || application === void 0 ? void 0 : application.finalize) !== null && _d !== void 0 ? _d : (0, exports.createApplicationCaller)();
    return Object.assign({
        stack,
        initialize,
        handle,
        finalize,
        use: (middleware) => stack.add(middleware),
        ready: () => initialize(stack.initializer().reverse()),
        process: () => handle(stack.handler().reverse()),
        close: () => finalize(stack.finalizer().reverse()),
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